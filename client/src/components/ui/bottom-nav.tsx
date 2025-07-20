import { Link } from "wouter";
import { History, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportData } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

interface BottomNavProps {
  unsyncedCount: number;
}

export default function BottomNav({ unsyncedCount }: BottomNavProps) {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportData('csv');
      toast({
        title: "Export successful",
        description: "Data exported as CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="border-t bg-white p-4">
      <div className="grid grid-cols-3 gap-3">
        <Link href="/history">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 py-2 h-auto relative">
            <History className="w-5 h-5" />
            <span className="text-xs font-medium">History</span>
            {unsyncedCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs">
                {unsyncedCount}
              </Badge>
            )}
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          onClick={handleExport}
          className="flex flex-col items-center space-y-1 py-2 h-auto"
        >
          <Download className="w-5 h-5" />
          <span className="text-xs font-medium">Export</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 py-2 h-auto"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </Button>
      </div>
    </footer>
  );
}
