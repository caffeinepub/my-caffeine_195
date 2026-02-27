/**
 * Client-side image compression utility using HTML Canvas.
 * Resizes images to max 800px on the longest side and compresses to JPEG at 65% quality.
 * This ensures the base64 payload stays well under ICP's 2MB ingress limit.
 */

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.65;

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file: must be an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down to fit within MAX_DIMENSION while maintaining aspect ratio
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width >= height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve(compressed);
        } catch (err) {
          reject(new Error('Image compression failed: ' + String(err)));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
