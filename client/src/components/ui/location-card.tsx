import { MapPin, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LocationCardProps {
  location: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  isLoading: boolean;
}

export default function LocationCard({ location, accuracy, isLoading }: LocationCardProps) {
  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Current Location</span>
          {isLoading && <RotateCcw className="w-4 h-4 text-blue-600 animate-spin" />}
        </div>
        
        <div className="text-sm text-blue-700">
          {location ? (
            <>
              <div>
                Lat: {formatCoordinate(location.latitude, 'lat')}, 
                Lng: {formatCoordinate(location.longitude, 'lng')}
              </div>
              {accuracy && (
                <div className="text-xs mt-1">
                  Accuracy: ±{Math.round(accuracy)}m
                </div>
              )}
            </>
          ) : (
            <div>Acquiring GPS location...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
