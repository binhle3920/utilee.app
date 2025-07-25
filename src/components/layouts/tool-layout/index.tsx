import { Flex, Layout, Typography } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/container';
import { useIsMobile } from '@/hooks/use-mobile';
import Route from '@/utils/constants/route';

const { Title, Text } = Typography;

interface IProps {
  children?: ReactNode;
  actions?: ReactNode[];
  title?: string;
  description?: string;
}

const ToolLayout = (props: IProps) => {
  const { children, actions, title, description } = props;

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const onClickLogo = () => {
    navigate(Route.DASHBOARD);
  };

  return (
    <Layout className='h-screen'>
      <Layout.Header className='p-0! flex'>
        <Container>
          <Flex justify='space-between' align='center'>
            <Flex align='center' gap={8} className='cursor-pointer -ml-1!' onClick={onClickLogo}>
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
              {!isMobile && (
                <Typography.Title level={3} className='mb-0! text-white!'>
                  Utilee
                </Typography.Title>
              )}
            </Flex>

            {actions?.map((action, index) => <div key={index}>{action}</div>)}
          </Flex>
        </Container>
      </Layout.Header>
      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll mt-4 pb-8'>
          {title && description && (
            <Flex justify='center' vertical>
              <Title level={2} className='mb-0!'>
                {title}
              </Title>
              <Text type='secondary'>{description}</Text>
            </Flex>
          )}

          {children}
        </Container>
      </Layout.Content>
    </Layout>
  );
};

export default ToolLayout;
