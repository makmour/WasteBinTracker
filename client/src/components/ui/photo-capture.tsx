import { Camera, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoCaptureProps {
  photoData: File | null;
  onCapturePhoto: () => void;
  onRemovePhoto: () => void;
}

export default function PhotoCapture({ photoData, onCapturePhoto, onRemovePhoto }: PhotoCaptureProps) {
  const photoUrl = photoData ? URL.createObjectURL(photoData) : null;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {!photoData ? (
        <div className="space-y-3">
          <Camera className="w-8 h-8 text-gray-400 mx-auto" />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={onCapturePhoto}
              className="touch-target"
            >
              <Camera className="w-4 h-4 mr-2" />
              TAKE PHOTO
            </Button>
          </div>
          <p className="text-sm text-gray-500">Tap to capture bin location photo</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={photoUrl!}
              alt="Captured waste bin photo"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemovePhoto}
              className="absolute top-2 right-2 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onCapturePhoto}
            className="touch-target"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        </div>
      )}
    </div>
  );
}
