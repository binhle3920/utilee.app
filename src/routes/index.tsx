import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import SuspenseLoading from '@/components/loadings/SuspenseLoading';
import Route from '@/utils/constants/route';

// Lazy loaded screens
const DashboardScreen = lazy(() => import('@/containers/dashboard/DashboardScreen'));
const ImageConverterScreen = lazy(() => import('@/containers/tools/image-tools/image-converter/ImageConverterScreen'));
const JsonFormatterScreen = lazy(() => import('@/containers/tools/text-tools/json-formatter/JsonFormatterScreen'));
const LoremIpsumGeneratorScreen = lazy(
  () => import('@/containers/tools/text-tools/lorem-generator/LoremIpsumGeneratorScreen')
);
const PasswordGeneratorScreen = lazy(
  () => import('@/containers/tools/text-tools/password-generator/PasswordGeneratorScreen')
);
const NoteScreen = lazy(() => import('@/containers/tools/text-tools/note/NoteScreen'));
const TextComparisonScreen = lazy(() => import('@/containers/tools/text-tools/text-comparision/TextComparisonScreen'));

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
    element: withSuspense(NoteScreen)
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
    element: withSuspense(TextComparisonScreen)
  },
  {
    path: Route.TOOLS.JSON_FORMATTER,
    element: withSuspense(JsonFormatterScreen)
  },
  {
    path: Route.TOOLS.PASSWORD_GENERATOR,
    element: withSuspense(PasswordGeneratorScreen)
  },
  {
    path: '*',
    element: <Navigate to={Route.DASHBOARD} />
  }
]);

export default router;
