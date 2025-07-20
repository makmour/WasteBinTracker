import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BinSurveyEntry } from "@shared/schema";

interface StreetReport {
  street: string;
  totalBins: number;
  binCounts: {
    Green: number;
    Blue: number;
    Brown: number;
    Yellow: number;
  };
  entryCount: number;
  lastSurvey: string;
}

export default function Reports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/entries"],
  });

  const resetStreetMutation = useMutation({
    mutationFn: async (street: string) => {
      const response = await apiRequest("DELETE", `/api/streets/${encodeURIComponent(street)}/reset`);
      return response.json();
    },
    onSuccess: (_, street) => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Street data reset",
        description: `All entries for ${street} have been deleted`,
      });
    },
    onError: () => {
      toast({
        title: "Error resetting street data",
        description: "Unable to reset street data",
        variant: "destructive",
      });
    },
  });

  const getBinTypeColor = (type: string) => {
    const colors = {
      Green: 'bg-green-500',
      Blue: 'bg-blue-500',
      Brown: 'bg-amber-600',
      Yellow: 'bg-yellow-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const generateStreetReports = (): StreetReport[] => {
    const streetData: { [key: string]: BinSurveyEntry[] } = {};
    
    entries.forEach((entry: BinSurveyEntry) => {
      if (!streetData[entry.street]) {
        streetData[entry.street] = [];
      }
      streetData[entry.street].push(entry);
    });

    return Object.entries(streetData).map(([street, streetEntries]) => {
      const binCounts = { Green: 0, Blue: 0, Brown: 0, Yellow: 0 };
      let totalBins = 0;
      
      streetEntries.forEach(entry => {
        totalBins += entry.quantity;
        entry.binTypes.forEach(type => {
          if (type in binCounts) {
            binCounts[type as keyof typeof binCounts]++;
          }
        });
      });

      const lastSurvey = streetEntries
        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0]
        .datetime;

      return {
        street,
        totalBins,
        binCounts,
        entryCount: streetEntries.length,
        lastSurvey: new Date(lastSurvey).toLocaleDateString(),
      };
    }).sort((a, b) => b.totalBins - a.totalBins);
  };

  const handleResetStreet = async (street: string) => {
    if (window.confirm(`Are you sure you want to delete all survey data for ${street}? This action cannot be undone.`)) {
      resetStreetMutation.mutate(street);
    }
  };

  const handleExportReport = () => {
    const reports = generateStreetReports();
    const csvContent = [
      ['Street', 'Total Bins', 'Green', 'Blue', 'Brown', 'Yellow', 'Surveys', 'Last Survey'].join(','),
      ...reports.map(report => [
        `"${report.street}"`,
        report.totalBins,
        report.binCounts.Green,
        report.binCounts.Blue,
        report.binCounts.Brown,
        report.binCounts.Yellow,
        report.entryCount,
        `"${report.lastSurvey}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `street-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Report exported",
      description: "Street report downloaded as CSV",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const streetReports = generateStreetReports();

  return (
    <>
      {/* Header */}
      <header className="bg-primary text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-primary-foreground/10 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Street Reports</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportReport}
            className="text-white hover:bg-primary-foreground/10"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {streetReports.length} streets
          </Badge>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Summary Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Survey Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-800">
                  {streetReports.reduce((sum, report) => sum + report.totalBins, 0)}
                </div>
                <div className="text-sm text-blue-600">Total Bins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-800">
                  {entries.length}
                </div>
                <div className="text-sm text-blue-600">Total Surveys</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Street Reports */}
        <div className="space-y-3">
          {streetReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No survey data available</p>
                <Link href="/">
                  <Button className="mt-4">
                    Start First Survey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            streetReports.map((report) => (
              <Card key={report.street} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.street}</h3>
                      <p className="text-sm text-gray-600">
                        {report.entryCount} surveys • Last: {report.lastSurvey}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {report.totalBins} bins
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetStreet(report.street)}
                        disabled={resetStreetMutation.isPending}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(report.binCounts).map(([type, count]) => (
                      <div key={type} className="text-center p-2 border rounded">
                        <div className={`w-4 h-4 ${getBinTypeColor(type)} rounded-full mx-auto mb-1`}></div>
                        <div className="text-sm font-medium">{count}</div>
                        <div className="text-xs text-gray-500">{type}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </>
  );
}