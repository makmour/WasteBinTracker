import { useState, useMemo } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MUNICIPALITIES, GLYFADA_STREETS } from "@shared/schema";

interface Location {
  latitude: number;
  longitude: number;
}

interface StreetSelectorProps {
  value: string;
  onChange: (street: string) => void;
  location?: Location;
  className?: string;
}

// Calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Simple street coordinate estimation based on Glyfada center
function getStreetCoordinates(streetName: string): Location {
  // This is a simplified approach - in a real app, you'd have a proper geocoding service
  const glyfadaCenter = { latitude: 37.8667, longitude: 23.7667 };
  
  // Add some variation to simulate different street locations within Glyfada
  const hash = streetName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const latOffset = ((hash % 100) - 50) * 0.001; // ±0.05 degrees (~5km)
  const lonOffset = (((hash * 7) % 100) - 50) * 0.001;
  
  return {
    latitude: glyfadaCenter.latitude + latOffset,
    longitude: glyfadaCenter.longitude + lonOffset
  };
}

export default function StreetSelector({ value, onChange, location, className }: StreetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"nearby" | "search" | "all">("nearby");
  const [selectedMunicipality] = useState("Glyfada"); // For now, always Glyfada

  const municipality = MUNICIPALITIES.find(m => m.name === selectedMunicipality);
  
  const filteredStreets = useMemo(() => {
    if (!municipality) return [];
    
    const streets = Array.from(municipality.streets);
    
    if (viewMode === "search") {
      if (searchTerm.trim()) {
        return streets.filter(street => 
          street.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 20); // Limit results for performance
      } else {
        // Show all streets when in search mode but no search term
        return streets.slice(0, 20);
      }
    }
    
    if (viewMode === "nearby" && location) {
      // Get streets within 2km radius, sorted by distance
      const streetsWithDistance = streets.map(street => {
        const streetCoords = getStreetCoordinates(street);
        const distance = calculateDistance(
          location.latitude, 
          location.longitude,
          streetCoords.latitude,
          streetCoords.longitude
        );
        return { street, distance };
      });
      
      return streetsWithDistance
        .filter(item => item.distance <= 2) // Within 2km
        .sort((a, b) => a.distance - b.distance)
        .map(item => item.street)
        .slice(0, 15); // Show top 15 nearest
    }
    
    if (viewMode === "all") {
      return streets.slice(0, 50); // Show first 50 for performance
    }
    
    return [];
  }, [municipality, searchTerm, viewMode, location]);

  const handleModeChange = (mode: "nearby" | "search" | "all") => {
    setViewMode(mode);
    setSearchTerm("");
  };

  const handleStreetSelect = (street: string) => {
    onChange(street);
  };

  return (
    <div className={className}>
      {/* Municipality Display */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Municipality
        </label>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedMunicipality}
          </Badge>
          <span className="text-xs text-gray-500">
            (Static for MVP - will be dynamic later)
          </span>
        </div>
      </div>

      {/* Street Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 block">
          Street Selection
        </label>

        {/* Mode Selection */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={viewMode === "nearby" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("nearby")}
            disabled={!location}
            className="flex items-center space-x-1"
          >
            <MapPin className="w-4 h-4" />
            <span>Nearby</span>
          </Button>
          <Button
            type="button"
            variant={viewMode === "search" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("search")}
            className="flex items-center space-x-1"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
          <Button
            type="button"
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("all")}
            className="flex items-center space-x-1"
          >
            <Clock className="w-4 h-4" />
            <span>All</span>
          </Button>
        </div>

        {/* Search Input */}
        {viewMode === "search" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for a street... (e.g. 'Metaxa', 'Vouliagmenis')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500">
          {viewMode === "nearby" && !location && "Enable GPS to see nearby streets"}
          {viewMode === "nearby" && location && `Showing streets within 2km of your location`}
          {viewMode === "search" && searchTerm && `Found ${filteredStreets.length} streets matching "${searchTerm}"`}
          {viewMode === "search" && !searchTerm && `Search through ${municipality?.streets.length || 0} available streets`}
          {viewMode === "all" && "Browse all available streets"}
        </div>

        {/* Street List/Select */}
        {filteredStreets.length > 0 ? (
          viewMode === "search" || viewMode === "nearby" ? (
            <Card className="max-h-60 overflow-y-auto">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {filteredStreets.map((street) => (
                    <Button
                      key={street}
                      type="button"
                      variant={value === street ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleStreetSelect(street)}
                      className="w-full justify-start text-left"
                    >
                      {street}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a street" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredStreets.map((street) => (
                  <SelectItem key={street} value={street}>
                    {street}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        ) : (
          <div className="text-center text-gray-500 py-4">
            {viewMode === "search" && searchTerm ? "No streets found" : "No streets available"}
          </div>
        )}

        {/* Current Selection Display */}
        {value && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900">Selected Street:</div>
            <div className="text-blue-700">{value}</div>
          </div>
        )}
      </div>
    </div>
  );
}