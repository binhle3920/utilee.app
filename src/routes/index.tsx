import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardScreen from '../containers/dashboard/index.tsx';
import DashboardLayout from '../containers/dashboard/layout/index.tsx';
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
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
