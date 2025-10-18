"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

export function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      // Validate file types
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} не является изображением`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} слишком большой (макс. 10MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => {
        const updated = [...prev, ...validFiles];
        onImagesChange(updated);
        return updated;
      });

      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [onImagesChange]
  );

  const removeImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index]);

      setImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        onImagesChange(updated);
        return updated;
      });

      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [previews, onImagesChange]
  );

  return (
    <div className="space-y-3">
      {/* Upload button */}
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Card className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-700 bg-zinc-900 p-4 hover:border-yellow-600 hover:bg-zinc-800 transition-colors">
          <Upload className="h-5 w-5 text-zinc-400" />
          <span className="text-xs text-zinc-400">
            Upload images (max 10MB)
          </span>
        </Card>
      </label>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full rounded object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-zinc-500">
          Uploaded: {images.length} {images.length === 1 ? "image" : "images"}
        </p>
      )}
    </div>
  );
}
