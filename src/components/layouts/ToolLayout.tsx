import { IconArrowLeft } from '@tabler/icons-react';
import { Button, Flex, Layout, Typography } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/Container';
import { useIsMobile } from '@/hooks/use-mobile';
import Route from '@/utils/constants/route';

interface IProps {
  children?: ReactNode;
  actions?: ReactNode[];
  title?: string;
}

const ToolLayout = (props: IProps) => {
  const { children, actions, title } = props;

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const onClickLogo = () => {
    navigate(Route.DASHBOARD);
  };

  return (
    <Layout className='h-screen animated-bg flex flex-col overflow-hidden'>
      <Layout.Header className='p-0! flex h-14! justify-center'>
        <Container>
          <Flex justify='space-between' align='center' className='h-full!'>
            <Flex align='center' gap={12} className='cursor-pointer -ml-1!' onClick={onClickLogo}>
              <Button
                type='text'
                icon={<IconArrowLeft size={18} />}
                className='text-[var(--text-secondary)]! hover:text-orange-400! hover:bg-[var(--bg-hover)]!'
              />
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-9 h-9 rounded-lg' />
              {!isMobile && (
                <Typography.Title level={4} className='mb-0! text-gradient-orange font-bold!'>
                  Utilee
                </Typography.Title>
              )}
            </Flex>
          </Flex>
        </Container>
      </Layout.Header>

      <Layout.Content className='p-0 w-full bg-transparent! flex-1 overflow-hidden flex flex-col items-center'>
        <Container className='flex flex-col pt-5 pb-6 overflow-y-auto flex-1'>
          {/* Tool Title & Actions Bar */}
          <Flex justify='space-between' align='center' wrap='wrap' gap={12} className='pb-4! shrink-0'>
            <Typography.Title level={3} className='mb-0! text-[var(--text-primary)]! font-semibold!'>
              {title}
            </Typography.Title>

            {actions && actions.length > 0 && (
              <Flex gap={8} align='center' wrap='wrap' className='flex-shrink-0'>
                {actions.map((action, index) => (
                  <div key={index}>{action}</div>
                ))}
              </Flex>
            )}
          </Flex>

          {/* Main Content */}
          <div className='flex flex-1 flex-col min-h-0'>{children}</div>
        </Container>
      </Layout.Content>
    </Layout>
  );
};

export default ToolLayout;
