import { theme, ThemeConfig } from 'antd';

// Custom theme: https://ant.design/docs/react/customize-theme
const customTheme: ThemeConfig = {
  cssVar: true,
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1ab8a6',
    borderRadius: 6
  }
};

export default customTheme;
