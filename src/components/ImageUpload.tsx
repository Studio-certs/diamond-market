import React, { useRef, useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImagesChange: (urls: { url: string; isPrimary: boolean }[]) => void;
  existingImages?: { url: string; isPrimary: boolean }[];
}

export function ImageUpload({ onImagesChange, existingImages = [] }: ImageUploadProps) {
  const { uploadImage, uploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>(existingImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      if (url) {
        const newImages = [...images, { url, isPrimary: images.length === 0 }];
        setImages(newImages);
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    if (images[indexToRemove].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleSetPrimary = (indexToSetPrimary: number) => {
    const newImages = images.map((image, index) => ({
      ...image,
      isPrimary: index === indexToSetPrimary
    }));
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Diamond Images
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
              image.isPrimary ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <img
                src={image.url}
                alt={`Diamond view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!image.isPrimary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title="Set as primary"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {image.isPrimary && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                Primary
              </span>
            )}
          </div>
        ))}

        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <label
            htmlFor="file-upload"
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Image</span>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
          Uploading...
        </div>
      )}

      <p className="text-xs text-gray-500">
        Upload multiple images of the diamond. The first image will be set as primary automatically.
        You can change the primary image by clicking the star icon.
      </p>
    </div>
  );
}