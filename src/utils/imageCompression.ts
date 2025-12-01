/**
 * Compresses an image file to meet the specified maximum file size
 * @param file - The original image file
 * @param maxSizeKB - Maximum size in kilobytes (default: 512KB)
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  maxSizeKB: number = 200,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate square dimensions (crop to center square)
        const size = Math.min(img.width, img.height, maxWidth);
        
        // Calculate crop position to center the image
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;
        
        // Create square canvas
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw the center square portion of the image
        ctx.drawImage(
          img,
          sourceX, sourceY, size, size,  // Source rectangle (crop from center)
          0, 0, size, size                // Destination rectangle (full canvas)
        );
        
        // Start with high quality and reduce until size requirement is met
        let quality = 0.9;
        const maxSizeBytes = maxSizeKB * 1024;
        
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              // If size is acceptable or quality is already very low, use this version
              if (blob.size <= maxSizeBytes || quality <= 0.1) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: 'image/jpeg', lastModified: Date.now() }
                );
                
                console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(blob.size / 1024).toFixed(2)}KB`);
                resolve(compressedFile);
                return;
              }
              
              // Reduce quality and try again
              quality -= 0.1;
              tryCompress();
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
