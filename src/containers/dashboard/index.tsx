import { Flex, Typography } from 'antd';

const DashboardScreen = () => {
  return (
    <Flex className='w-full h-full pt-12! lg:px-40!' justify='start' align='center' vertical>
      <Typography.Title level={1}>Welcome to DEV Utilities</Typography.Title>
    </Flex>
  );
};

export default DashboardScreen;
