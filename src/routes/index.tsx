import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardLayout from '@/components/layouts/dashboard-layout/index.tsx';
import SuspenseLoading from '@/components/loadings/suspense-loading/index.tsx';
import Route from '@/utils/constants/route.ts';

const DashboardScreen = lazy(() => import('@/containers/dashboard/index.tsx'));
const ImageConverterScreen = lazy(() => import('@/containers/tools/image-tools/image-converter/index.tsx'));
const JsonFormatterScreen = lazy(() => import('@/containers/tools/text-tools/json-formatter/index.tsx'));
const LoremIpsumGeneratorScreen = lazy(() => import('@/containers/tools/text-tools/lorem-generator/index.tsx'));
const ToolsNoteScreen = lazy(() => import('@/containers/tools/text-tools/note/index.tsx'));
const TextComparisionScreen = lazy(() => import('@/containers/tools/text-tools/text-comparision/index.tsx'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<SuspenseLoading />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: Route.DASHBOARD,
        element: withSuspense(DashboardScreen)
      }
    ]
  },
  {
    path: Route.TOOLS.NOTE,
    element: withSuspense(ToolsNoteScreen)
  },
  {
    path: Route.TOOLS.LOREM_GENERATOR,
    element: withSuspense(LoremIpsumGeneratorScreen)
  },
  {
    path: Route.TOOLS.IMAGE_CONVERTER,
    element: withSuspense(ImageConverterScreen)
  },
  {
    path: Route.TOOLS.TEXT_COMPARISON,
    element: withSuspense(TextComparisionScreen)
  },
  {
    path: Route.TOOLS.JSON_FORMATTER,
    element: withSuspense(JsonFormatterScreen)
  },
  {
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
