import { Flex, Spin } from 'antd';

const SuspenseLoading = () => {
  return (
    <Flex justify='center' align='center' className='ant-layout-header' style={{ height: '100vh' }}>
      <Spin size='large' />
    </Flex>
  );
};

export default SuspenseLoading;
