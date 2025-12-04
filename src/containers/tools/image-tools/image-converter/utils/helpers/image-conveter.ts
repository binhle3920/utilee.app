import { RcFile } from 'antd/es/upload';

import type { ConvertedImage } from '@/containers/tools/image-tools/image-converter/utils/types';

/**
 * Converts an image file to the specified format and quality
 * @param file - The original image file
 * @param format - Target format (webp, jpeg, png, avif)
 * @param quality - Quality percentage (10-100)
 * @returns Promise that resolves to the converted Blob
 */
export const convertImage = (file: RcFile, format: string, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        // Handle transparency for PNG and WebP
        if (format === 'png' || format === 'webp') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          // Fill white background for JPEG and AVIF
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Different handling for different formats
        const mimeType = `image/${format}`;
        const qualityValue = format === 'png' ? undefined : quality / 100;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error(`Failed to convert image to ${format}`));
            }
          },
          mimeType,
          qualityValue
        );
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.crossOrigin = 'anonymous'; // Handle CORS issues
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Processes multiple files for batch conversion
 * @param files - Array of files to convert
 * @param format - Target format
 * @param quality - Quality percentage
 * @param onProgress - Progress callback function
 * @returns Promise that resolves to array of converted images
 */
export const convertMultipleImages = async (
  files: RcFile[],
  format: string,
  quality: number,
  onProgress?: (progress: number) => void
): Promise<ConvertedImage[]> => {
  const convertedImages: ConvertedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const convertedBlob = await convertImage(file, format, quality);
    const convertedUrl = URL.createObjectURL(convertedBlob);

    convertedImages.push({
      id: `${file.name}-${Date.now()}`,
      originalFile: file,
      convertedBlob,
      convertedUrl,
      originalSize: file.size,
      convertedSize: convertedBlob.size,
      format,
      quality
    });

    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }

  return convertedImages;
};
