import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

import Container from '../../../components/container';

const DashboardLayout = () => {
  return (
    <Layout className='h-screen'>
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
