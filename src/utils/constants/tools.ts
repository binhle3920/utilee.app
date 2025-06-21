import ImageToolsImageConverter from '../../assets/svg/tools/image_converter.svg';
import ImageToolsLoremGenerator from '../../assets/svg/tools/lorem.svg';
import ImageToolsNote from '../../assets/svg/tools/note.svg';
import ImageToolsTextComparision from '../../assets/svg/tools/text-comparision.svg';
import Route from './route';

const tools = {
  note: {
    title: 'Offline Notes',
    description:
      'Create and organize your thoughts with our intuitive note-taking tool. All notes are saved locally, ensuring privacy and offline access!',
    path: Route.TOOLS.NOTE,
    image: ImageToolsNote
  },
  loremGenerator: {
    title: 'Lorem Ipsum Generator',
    description:
      'Generate professional placeholder text for your designs and mockups. Customize length and style to fit your project needs perfectly!',
    path: Route.TOOLS.LOREM_GENERATOR,
    image: ImageToolsLoremGenerator
  },
  imageConverter: {
    title: 'Image Converter',
    description: 'Convert images to different formats and sizes. Perfect for social media and web design projects!',
    path: Route.TOOLS.IMAGE_CONVERTER,
    image: ImageToolsImageConverter
  },
  textComparison: {
    title: 'Text Comparison',
    description: 'Compare two texts and see the difference between them.',
    path: Route.TOOLS.TEXT_COMPARISION,
    image: ImageToolsTextComparision
  }
};

export default tools;
