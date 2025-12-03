import { theme, ThemeConfig } from 'antd';

// Orange gradient color palette
const orangeGradient = {
  primary: '#f97316', // Vivid orange
  primaryLight: '#fb923c', // Lighter orange
  primaryDark: '#ea580c', // Darker orange
  gradientStart: '#f97316',
  gradientMid: '#fb923c',
  gradientEnd: '#fbbf24' // Amber hint
};

// Dark mode background colors
const darkColors = {
  bgBase: '#0a0a0f', // Deep dark
  bgElevated: '#12121a', // Slightly elevated
  bgContainer: '#1a1a24', // Container background
  bgSpotlight: '#22222e', // Spotlight/hover
  bgSurface: '#16161f', // Surface
  border: '#2a2a3a', // Subtle border
  borderLight: '#3a3a4a' // Lighter border
};

// Custom theme: https://ant.design/docs/react/customize-theme
const customTheme: ThemeConfig = {
  cssVar: true,
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorPrimary: orangeGradient.primary,
    colorPrimaryHover: orangeGradient.primaryLight,
    colorPrimaryActive: orangeGradient.primaryDark,
    colorLink: orangeGradient.primaryLight,
    colorLinkHover: orangeGradient.primary,
    colorBgBase: darkColors.bgBase,
    colorBgContainer: darkColors.bgContainer,
    colorBgElevated: darkColors.bgElevated,
    colorBgSpotlight: darkColors.bgSpotlight,
    colorBorder: darkColors.border,
    colorBorderSecondary: darkColors.borderLight,
    colorText: 'rgba(255, 255, 255, 0.92)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8
  },
  components: {
    Layout: {
      headerBg: darkColors.bgElevated,
      bodyBg: darkColors.bgBase,
      siderBg: darkColors.bgSurface,
      footerBg: darkColors.bgElevated
    },
    Card: {
      colorBgContainer: darkColors.bgContainer,
      colorBorderSecondary: darkColors.border,
      boxShadowTertiary: '0 4px 24px rgba(0, 0, 0, 0.3)'
    },
    Button: {
      primaryShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
      defaultBg: darkColors.bgSpotlight,
      defaultBorderColor: darkColors.border,
      defaultColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 10
    },
    Input: {
      colorBgContainer: darkColors.bgSpotlight,
      colorBorder: darkColors.border,
      activeBorderColor: orangeGradient.primary,
      hoverBorderColor: orangeGradient.primaryLight,
      colorTextPlaceholder: 'rgba(255, 255, 255, 0.35)'
    },
    Select: {
      colorBgContainer: darkColors.bgSpotlight,
      colorBorder: darkColors.border,
      optionSelectedBg: 'rgba(249, 115, 22, 0.15)'
    },
    Modal: {
      contentBg: darkColors.bgElevated,
      headerBg: darkColors.bgElevated,
      titleColor: 'rgba(255, 255, 255, 0.92)'
    },
    Divider: {
      colorSplit: darkColors.border
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(249, 115, 22, 0.15)',
      itemHoverBg: 'rgba(255, 255, 255, 0.06)'
    },
    Dropdown: {
      colorBgElevated: darkColors.bgElevated
    },
    Tag: {
      defaultBg: darkColors.bgSpotlight,
      defaultColor: 'rgba(255, 255, 255, 0.85)'
    },
    Slider: {
      trackBg: orangeGradient.primary,
      trackHoverBg: orangeGradient.primaryLight,
      handleColor: orangeGradient.primary,
      handleActiveColor: orangeGradient.primaryLight,
      railBg: darkColors.bgSpotlight,
      railHoverBg: darkColors.border
    },
    Progress: {
      defaultColor: orangeGradient.primary
    },
    Upload: {
      colorBgContainer: darkColors.bgSpotlight,
      colorBorder: darkColors.border
    },
    Drawer: {
      colorBgElevated: darkColors.bgSurface
    },
    Message: {
      contentBg: darkColors.bgElevated
    },
    Tooltip: {
      colorBgSpotlight: darkColors.bgElevated,
      colorTextLightSolid: 'rgba(255, 255, 255, 0.92)'
    }
  }
};

export { orangeGradient, darkColors };
export default customTheme;
