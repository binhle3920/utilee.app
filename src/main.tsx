import { ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import customTheme from './utils/theme.ts';
import './utils/styles/index.css';
import './utils/styles/override.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
