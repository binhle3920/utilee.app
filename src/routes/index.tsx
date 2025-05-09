import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardScreen from '../containers/dashboard/index.tsx';
import DashboardLayout from '../containers/dashboard/layout/index.tsx';
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
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
