import { App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import SuspendLoading from '@/components/loadings/suspense-loading';
import router from '@/routes';

// Setup dayjs locale to English
dayjs.locale('en');

function App() {
  return (
    <Suspense fallback={<SuspendLoading />}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </Suspense>
  );
}

export default App;
