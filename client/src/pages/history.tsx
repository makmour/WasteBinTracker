import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Download, MapPin, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exportData } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";
import type { BinSurveyEntry } from "@shared/schema";

export default function History() {
  const { toast } = useToast();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/entries"],
  });

  const handleExport = async (format: 'csv' | 'geojson') => {
    try {
      await exportData(format);
      toast({
        title: "Export successful",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export data",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getBinTypeColor = (type: string) => {
    const colors = {
      Green: 'bg-green-500',
      Blue: 'bg-blue-500',
      Brown: 'bg-amber-600',
      Yellow: 'bg-yellow-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading entries...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold">Survey History</h1>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {entries.length} entries
        </Badge>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="touch-target"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('geojson')}
            className="touch-target"
          >
            <Download className="w-4 h-4 mr-2" />
            Export GeoJSON
          </Button>
        </div>

        {/* Entries List */}
        <div className="space-y-3">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No survey entries yet</p>
                <Link href="/">
                  <Button className="mt-4">
                    Create First Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry: BinSurveyEntry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(entry.datetime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!entry.synced && (
                        <Badge variant="destructive" className="text-xs">
                          Not Synced
                        </Badge>
                      )}
                      {entry.photoUri && (
                        <Camera className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{entry.street}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.binTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${getBinTypeColor(type)}`}></div>
                          <span className="text-sm text-gray-600">{type}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Quantity:</span> {entry.quantity} bins
                    </div>

                    {entry.comments && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Comments:</span> {entry.comments}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      GPS: {entry.latitude.toFixed(6)}, {entry.longitude.toFixed(6)}
                    </div>
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
