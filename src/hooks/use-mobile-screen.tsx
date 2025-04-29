import { useBreakpoint } from '@ant-design/pro-components';

const useMobileScreen = () => {
  const screens = useBreakpoint();

  return screens === 'sm' || screens === 'xs';
};

export default useMobileScreen;
