import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardLayout from '../components/layouts/dashboard-layout/index.tsx';
import DashboardScreen from '../containers/dashboard/index.tsx';
import ImageConverterScreen from '../containers/tools/image-converter/index.tsx';
import LoremIpsumGeneratorScreen from '../containers/tools/lorem-generator/index.tsx';
import ToolsNoteScreen from '../containers/tools/note/index.tsx';
import Route from '../utils/constants/route.ts';

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
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
