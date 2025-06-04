import { Flex, Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

import Container from '../../../components/container';

const DashboardLayout = () => {
  const onBuyMeACoffee = () => {
    window.open('https://coff.ee/binhle', '_blank');
  };

  return (
    <Layout className='h-screen'>
      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll flex'>
          <Outlet />
        </Container>
      </Layout.Content>
      <Layout.Footer className='p-0'>
        <Container>
          <Flex justify='between' align='center'>
            <Typography.Text className='w-full'>©2025 Created by Binh Le</Typography.Text>

            {/* Generate a buy me a coffee button */}
            <img
              src={'https://cdn.buymeacoffee.com/buttons/default-orange.png'}
              alt='Buy me a coffee'
              className='w-40 aspect-2.8/1 rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300'
              onClick={onBuyMeACoffee}
            />
          </Flex>
        </Container>
      </Layout.Footer>
    </Layout>
  );
};

export default DashboardLayout;
