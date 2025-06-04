/**
 * Formats file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string with appropriate unit
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculates compression ratio between original and converted file sizes
 * @param original - Original file size in bytes
 * @param converted - Converted file size in bytes
 * @returns Formatted percentage string with + or - prefix
 */
export const getCompressionRatio = (original: number, converted: number): string => {
  const ratio = ((original - converted) / original) * 100;
  return ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`;
};
