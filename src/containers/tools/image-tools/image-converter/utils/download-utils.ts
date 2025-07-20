import { ConvertedImage } from '@/containers/tools/image-tools/image-converter/utils/image-conveter';

/**
 * Downloads a single converted image
 * @param convertedImage - The converted image object containing blob and metadata
 */
export const downloadImage = (convertedImage: ConvertedImage): void => {
  const link = document.createElement('a');
  link.href = convertedImage.convertedUrl;
  link.download = `${convertedImage.originalFile.name.split('.')[0]}.${convertedImage.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Downloads multiple converted images with a small delay between each download
 * @param convertedImages - Array of converted image objects
 * @param delay - Delay in milliseconds between downloads (default: 100ms)
 */
export const downloadAllImages = (convertedImages: ConvertedImage[], delay: number = 100): void => {
  convertedImages.forEach((img, index) => {
    setTimeout(() => downloadImage(img), delay * index);
  });
};
