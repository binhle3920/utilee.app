import { MailOutlined } from '@ant-design/icons';
import { Flex, Layout, Typography, Button } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import Container from '../../../components/container';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const onClickLogo = () => {
    navigate('/');
  };

  const onBuyMeACoffee = () => {
    window.open('https://coff.ee/binhle', '_blank');
  };

  const onSendFeedback = () => {
    const subject = encodeURIComponent('Feedback for Utilee Application');
    const body = encodeURIComponent('Hi Binh,\n\nI have feedback about the Utilee application:\n\n');
    const mailtoUrl = `mailto:lethanhbinh3920@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Layout className='h-screen'>
      <Layout.Header>
        <Flex justify='space-between' align='center' vertical={false} className='h-full!'>
          <Flex align='center' gap={8} className='cursor-pointer' onClick={onClickLogo}>
            <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
            <Typography.Title level={3} className='text-white! mb-0!'>
              Utilee
            </Typography.Title>
          </Flex>

          {/* Send Feedback Button */}
          <Button type='default' icon={<MailOutlined />} onClick={onSendFeedback}>
            Send Feedback
          </Button>
        </Flex>
      </Layout.Header>

      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll flex'>
          <Outlet />
        </Container>
      </Layout.Content>

      <Layout.Footer className='p-0'>
        <Container>
          <Flex justify='between' align='center'>
            <Typography.Text className='w-full'>©2025 Created by Binh Le</Typography.Text>

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
