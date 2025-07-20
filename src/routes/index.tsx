import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardLayout from '@/components/layouts/dashboard-layout/index.tsx';
import DashboardScreen from '@/containers/dashboard/index.tsx';
import ImageConverterScreen from '@/containers/tools/image-tools/image-converter/index.tsx';
import JsonFormatterScreen from '@/containers/tools/text-tools/json-formatter/index.tsx';
import LoremIpsumGeneratorScreen from '@/containers/tools/text-tools/lorem-generator/index.tsx';
import ToolsNoteScreen from '@/containers/tools/text-tools/note/index.tsx';
import TextComparisionScreen from '@/containers/tools/text-tools/text-comparision/index.tsx';
import Route from '@/utils/constants/route.ts';

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: Route.DASHBOARD,
        element: <DashboardScreen />
      }
    ]
  },
  {
    path: Route.TOOLS.NOTE,
    element: <ToolsNoteScreen />
  },
  {
    path: Route.TOOLS.LOREM_GENERATOR,
    element: <LoremIpsumGeneratorScreen />
  },
  {
    path: Route.TOOLS.IMAGE_CONVERTER,
    element: <ImageConverterScreen />
  },
  {
    path: Route.TOOLS.TEXT_COMPARISON,
    element: <TextComparisionScreen />
  },
  {
    path: Route.TOOLS.JSON_FORMATTER,
    element: <JsonFormatterScreen />
  },
  {
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
