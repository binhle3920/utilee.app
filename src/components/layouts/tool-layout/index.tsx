import { Flex, Layout, Typography } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/container';
import useMobileScreen from '@/hooks/use-mobile-screen';
import Route from '@/utils/constants/route';

interface IProps {
  children?: ReactNode;
  actions?: ReactNode[];
}

const ToolLayout = (props: IProps) => {
  const { children, actions } = props;

  const navigate = useNavigate();
  const isMobile = useMobileScreen();

  const onClickLogo = () => {
    navigate(Route.DASHBOARD);
  };

  return (
    <Layout className='h-screen'>
      <Layout.Header className='p-0! bg-white! border-b border-gray-200! flex'>
        <Container>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={8} className='cursor-pointer -ml-1!' onClick={onClickLogo}>
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
              {!isMobile && (
                <Typography.Title level={3} className='mb-0!'>
                  Utilee
                </Typography.Title>
              )}
            </Flex>

            {actions?.map((action, index) => <div key={index}>{action}</div>)}
          </Flex>
        </Container>
      </Layout.Header>
      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll mt-4 pb-8'>{children}</Container>
      </Layout.Content>
    </Layout>
  );
};

export default ToolLayout;
