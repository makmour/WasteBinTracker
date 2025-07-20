import { Menu, Wifi, WifiOff, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isOffline: boolean;
  unsyncedCount: number;
}

export default function Header({ isOffline, unsyncedCount }: HeaderProps) {
  return (
    <header className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="text-white hover:bg-primary-foreground/10 -ml-2">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Waste Bin Survey</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {isOffline ? (
          <div className="offline-indicator px-2 py-1 rounded-full text-xs font-medium text-gray-800">
            <WifiOff className="w-3 h-3 mr-1 inline" />
            Offline
          </div>
        ) : (
          <div className="bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <Wifi className="w-3 h-3 mr-1 inline" />
            Online
          </div>
        )}
        
        <div className="bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
          <MapPin className="w-3 h-3 mr-1 inline" />
          GPS Ready
        </div>
      </div>
    </header>
  );
}
