import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { compressImage } from '../utils/imageCompression';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Compress the image to max 512KB
      const compressedFile = await compressImage(file, 512);

      // Create a unique file name with jpg extension since we compress to JPEG
      const fileExt = 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `diamonds/${fileName}`;

      // Upload the compressed file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('diamond-images')
        .upload(filePath, compressedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('diamond-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    preview,
    setPreview
  };
}
