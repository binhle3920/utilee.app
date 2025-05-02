import { Flex, Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

import Container from '../../../components/container';

const DashboardLayout = () => {
  return (
    <Layout className='h-screen'>
      <Layout.Header className='p-0 bg-white!'>
        <Flex justify='center' align='center' className='h-full w-full pt-8!'>
          <Typography.Title level={1} className='text-[#17B8A6]!'>
            Welcome to DEV Utilities
          </Typography.Title>
        </Flex>
      </Layout.Header>

      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll flex'>
          <Outlet />
        </Container>
      </Layout.Content>
      <Layout.Footer className='p-0'>
        <Container>
          <Typography.Text className='text-center w-full'>©2025 Created by DEV Utilities</Typography.Text>
        </Container>
      </Layout.Footer>
    </Layout>
  );
};

export default DashboardLayout;
