import { Flex, Layout, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import Container from '@/components/container';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const onClickLogo = () => {
    navigate('/');
  };

  const onBuyMeACoffee = () => {
    window.open('https://coff.ee/binhle', '_blank');
  };

  return (
    <Layout className='min-h-screen! flex'>
      <Layout.Header className='p-0!'>
        <Flex justify='space-between' align='center' vertical={false} className='h-full!'>
          <Container>
            <Flex align='center' gap={8} className='cursor-pointer' onClick={onClickLogo}>
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
              <Typography.Title level={3} className='text-white! mb-0!'>
                Utilee
              </Typography.Title>
            </Flex>
          </Container>
        </Flex>
      </Layout.Header>

      <Layout.Content className='p-0 w-full bg-white! flex-1'>
        <Container className='w-full overflow-scroll flex'>
          <Outlet />
        </Container>
      </Layout.Content>

      <Layout.Footer className='px-0!'>
        <Container>
          <Flex
            justify={isMobile ? 'center' : 'space-between'}
            align='center'
            gap={isMobile ? 16 : 0}
            vertical={isMobile}
          >
            <Typography.Text>©2025 Created by Binh Le</Typography.Text>

            {/* Buy me a coffee button */}
            <img
              src={'https://cdn.buymeacoffee.com/buttons/default-orange.png'}
              alt='Buy me a coffee'
              className='w-40 rounded-lg shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 object-contain'
              onClick={onBuyMeACoffee}
            />
          </Flex>
        </Container>
      </Layout.Footer>
    </Layout>
  );
};

export default DashboardLayout;
