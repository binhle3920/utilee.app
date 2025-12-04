const formatOptions: Array<{ label: string; value: string; description: string }> = [
  { label: 'WebP', value: 'webp', description: 'Modern format with excellent compression' },
  { label: 'JPEG', value: 'jpeg', description: 'Universal compatibility, lossy compression' },
  { label: 'PNG', value: 'png', description: 'Lossless compression, supports transparency' },
  { label: 'AVIF', value: 'avif', description: 'Next-gen format with superior compression' }
];

const qualityMarks = {
  10: '10%',
  50: '50%',
  80: '80%',
  100: '100%'
};

const defaultQuality = 80;
const defaultFormat = 'webp';

export { formatOptions, qualityMarks, defaultQuality, defaultFormat };
