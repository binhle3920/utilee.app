import { IconArrowLeft } from '@tabler/icons-react';
import { Button, Flex, Layout, Typography } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@/components/Container';
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
    <Layout className='h-screen animated-bg flex flex-col overflow-hidden'>
      <Layout.Header className='p-0! flex bg-[var(--bg-elevated)]! border-b border-[var(--border-default)]! h-16! shrink-0'>
        <Container>
          <Flex justify='space-between' align='center' className='h-full!'>
            <Flex align='center' gap={12} className='cursor-pointer -ml-1!' onClick={onClickLogo}>
              <Button
                type='text'
                icon={<IconArrowLeft size={18} />}
                className='text-[var(--text-secondary)]! hover:text-orange-400! hover:bg-[var(--bg-hover)]!'
              />
              <div className='relative'>
                <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-xl' />
                <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/10 pointer-events-none' />
              </div>
              {!isMobile && (
                <Typography.Title level={3} className='mb-0! text-gradient-orange font-bold!'>
                  Utilee
                </Typography.Title>
              )}
            </Flex>

            <Flex gap={8} align='center'>
              {actions?.map((action, index) => <div key={index}>{action}</div>)}
            </Flex>
          </Flex>
        </Container>
      </Layout.Header>

      <Layout.Content className='p-0 w-full bg-transparent! flex-1 overflow-hidden flex flex-col'>
        <Container className='flex flex-col py-6 overflow-y-scroll'>
          {title && description && (
            <Flex justify='center' vertical className='shrink-0'>
              <Title level={2} className='mb-1! text-[var(--text-primary)]! font-bold!'>
                <span className='text-gradient-orange'>{title}</span>
              </Title>
              <Text className='text-[var(--text-secondary)]! text-base!'>{description}</Text>
            </Flex>
          )}

          <div className='flex flex-1 flex-col pt-6'>{children}</div>
        </Container>
      </Layout.Content>
    </Layout>
  );
};

export default ToolLayout;
