import { useState, useRef } from "react";

export function useCamera() {
  const [photoData, setPhotoData] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const capturePhoto = () => {
    // Check if device supports camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // For modern browsers, use camera API
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Create video element to show camera feed
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          // For demo purposes, we'll use file input instead
          // In a real app, you'd implement proper camera capture
          triggerFileInput();
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          // Fallback to file input
          triggerFileInput();
        });
    } else {
      // Fallback to file input
      triggerFileInput();
    }
  };

  const triggerFileInput = () => {
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera on mobile
      fileInputRef.current = input;
    }

    fileInputRef.current.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setPhotoData(file);
      }
    };

    fileInputRef.current.click();
  };

  const removePhoto = () => {
    setPhotoData(null);
  };

  return {
    photoData,
    capturePhoto,
    removePhoto,
  };
}
