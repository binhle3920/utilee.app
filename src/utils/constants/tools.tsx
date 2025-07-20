import { IconLetterCase, IconPhoto } from '@tabler/icons-react';
import { ReactNode } from 'react';

import ImageToolsImageConverter from '@/assets/png/image-converter.png';
import ImageToolsJsonFormatter from '@/assets/png/json-formatter.png';
import ImageToolsLoremGenerator from '@/assets/png/lorem-generator.png';
import ImageToolsNote from '@/assets/png/note.png';
import ImageToolsTextComparison from '@/assets/png/text-comparision.png';
import Route from '@/utils/constants/route';

export interface Tool {
  title: string;
  description: string;
  path: string;
  image: string;
}

export interface ToolCategory {
  [key: string]: Tool;
}

export interface ToolsCollection {
  [key: string]: {
    icon: ReactNode;
    label: string;
    tools: ToolCategory;
  };
}

const textTools: ToolCategory = {
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
  textComparison: {
    title: 'Text Comparison',
    description: 'Compare two texts and see the difference between them with an intuitive diff viewer.',
    path: Route.TOOLS.TEXT_COMPARISON,
    image: ImageToolsTextComparison
  },
  jsonFormatter: {
    title: 'JSON Formatter',
    description: 'Format JSON data for better readability and structure.',
    path: Route.TOOLS.JSON_FORMATTER,
    image: ImageToolsJsonFormatter
  }
};

const imageTools: ToolCategory = {
  imageConverter: {
    title: 'Image Converter',
    description:
      'Convert images to different formats and sizes. Perfect for social media and web design projects with batch processing support!',
    path: Route.TOOLS.IMAGE_CONVERTER,
    image: ImageToolsImageConverter
  }
};

// Main tools collection
const iconSize = 20;
const tools: ToolsCollection = {
  text: {
    label: 'Text Tools',
    icon: <IconLetterCase size={iconSize} />,
    tools: textTools
  },
  image: {
    label: 'Image Tools',
    icon: <IconPhoto size={iconSize} />,
    tools: imageTools
  }
};

// Helper function to get all tools as a flat array
export const getAllTools = (): Tool[] => {
  return Object.values(tools).flatMap((category) => Object.values(category.tools));
};

// Helper function to get tools by category
export const getToolsByCategory = (category: keyof ToolsCollection): Tool[] => {
  return Object.values(tools[category].tools);
};

export const categoryKeys = Object.keys(tools) as (keyof ToolsCollection)[] as string[];

export default tools;
