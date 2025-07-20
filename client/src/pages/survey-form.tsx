import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertBinSurveyEntrySchema, GLYFADA_STREETS, BIN_TYPES, type InsertBinSurveyEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useCamera } from "@/hooks/use-camera";
import { useOffline } from "@/hooks/use-offline";
import Header from "@/components/ui/header";
import LocationCard from "@/components/ui/location-card";
import BinTypeSelector from "@/components/ui/bin-type-selector";
import PhotoCapture from "@/components/ui/photo-capture";
import BottomNav from "@/components/ui/bottom-nav";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, MapPin } from "lucide-react";

const formSchema = insertBinSurveyEntrySchema.extend({
  binTypes: insertBinSurveyEntrySchema.shape.binTypes.min(1, "Please select at least one bin type"),
  quantity: insertBinSurveyEntrySchema.shape.quantity.min(1, "Quantity must be at least 1"),
});

export default function SurveyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, accuracy, isLoading: locationLoading, refreshLocation } = useGeolocation();
  const { capturePhoto, photoData, removePhoto } = useCamera();
  const { isOffline } = useOffline();

  const form = useForm<InsertBinSurveyEntry>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      latitude: 0,
      longitude: 0,
      binTypes: [],
      quantity: 1,
      photoUri: "",
      comments: "",
    },
  });

  // Update form location when GPS location changes
  useEffect(() => {
    if (location) {
      form.setValue("latitude", location.latitude);
      form.setValue("longitude", location.longitude);
    }
  }, [location, form]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: InsertBinSurveyEntry) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "binTypes") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (photoData) {
        formData.append("photo", photoData);
      }

      const response = await apiRequest("POST", "/api/entries", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry saved successfully",
        description: isOffline ? "Data saved locally and will sync when online" : "Data saved to server",
      });
      form.reset();
      removePhoto();
    },
    onError: (error) => {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: unsyncedEntries = [] } = useQuery({
    queryKey: ["/api/entries/unsynced"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const onSubmit = (data: InsertBinSurveyEntry) => {
    if (!location) {
      toast({
        title: "Location required",
        description: "Please wait for GPS location or manually refresh location",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      ...data,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem("survey-draft", JSON.stringify(formData));
    toast({
      title: "Draft saved",
      description: "Your progress has been saved locally",
    });
  };

  return (
    <>
      <Header isOffline={isOffline} unsyncedCount={unsyncedEntries.length} />
      
      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        <LocationCard 
          location={location} 
          accuracy={accuracy} 
          isLoading={locationLoading} 
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Street Selection */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Street <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Select a street..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GLYFADA_STREETS.map((street) => (
                        <SelectItem key={street} value={street}>
                          {street}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bin Type Selection */}
            <FormField
              control={form.control}
              name="binTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bin Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <BinTypeSelector
                      value={field.value}
                      onChange={field.onChange}
                      options={BIN_TYPES}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Bins */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Number of Bins <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      className="bg-gray-50"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Photo (optional)
              </label>
              <PhotoCapture
                photoData={photoData}
                onCapturePhoto={capturePhoto}
                onRemovePhoto={removePhoto}
              />
            </div>

            {/* Comments Section */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-gray-50 resize-none"
                      rows={3}
                      placeholder="Additional notes about bin condition, accessibility, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-4 touch-target"
                disabled={createEntryMutation.isPending || locationLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {createEntryMutation.isPending ? "SAVING..." : "SUBMIT ENTRY"}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="touch-target"
                  onClick={handleSaveDraft}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="touch-target text-green-600 border-green-200 hover:bg-green-50"
                  onClick={refreshLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 mr-2" />
                  )}
                  Update GPS
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </main>

      <BottomNav unsyncedCount={unsyncedEntries.length} />
    </>
  );
}
