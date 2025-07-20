import { useState, useEffect } from "react";

interface GeolocationState {
  location: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    accuracy: null,
    isLoading: true,
    error: null,
  });

  const refreshLocation = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Geolocation is not supported by this browser"
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return {
    ...state,
    refreshLocation,
  };
}
