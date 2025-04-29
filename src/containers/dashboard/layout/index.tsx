import { Flex, Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

import Container from '../../../components/container';

const DashboardLayout = () => {
  return (
    <Layout className='h-screen'>
      <Layout.Content className='p-0 w-full'>
        <Flex justify='center' align='center' className='h-full w-full'>
          <Container className='h-full w-full overflow-scroll flex'>
            <Outlet />
          </Container>
        </Flex>
      </Layout.Content>
      <Layout.Footer className='p-0'>
        <Flex justify='center' align='center' className='h-full w-full'>
          <Container>
            <Flex justify='center' align='center' className='h-full'>
              <Typography.Text>©2025 Created by DEV Utilities</Typography.Text>
            </Flex>
          </Container>
        </Flex>
      </Layout.Footer>
    </Layout>
  );
};

export default DashboardLayout;
