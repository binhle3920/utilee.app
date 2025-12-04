import { RcFile } from 'antd/es/upload';

interface ConvertedImage {
  id: string;
  originalFile: RcFile;
  convertedBlob: Blob;
  convertedUrl: string;
  originalSize: number;
  convertedSize: number;
  format: string;
  quality: number;
}

export type { ConvertedImage };
