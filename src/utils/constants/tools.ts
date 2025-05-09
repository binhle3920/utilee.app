import ImageToolsLoremGenerator from '../../assets/svg/tools/lorem.svg';
import ImageToolsNote from '../../assets/svg/tools/note.svg';
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
  }
};

export default tools;
