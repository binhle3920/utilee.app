import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { IconCoffee, IconLayoutSidebar } from '@tabler/icons-react';
import { Flex, Layout, Typography, Button, Drawer, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import Container from '@/components/Container';
import { useIsMobile } from '@/hooks/use-mobile';
import { LOCAL_STORAGE_KEY } from '@/utils/constants/local-storage';
import tools, { categoryKeys, ToolsCollection } from '@/utils/constants/tools';

const { Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const DashboardLayout = () => {
  const [activeCategory, setActiveCategory] = useState<keyof ToolsCollection>('');
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const isMobile = useIsMobile();

  useEffect(() => {
    const category = searchParams.get('c');
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory('text');
      setSearchParams({ c: 'text' });
    }
  }, [searchParams]);

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const expandSidebar = localStorage.getItem(LOCAL_STORAGE_KEY.CONFIG.EXPAND_SIDEBAR);
    setCollapsed(expandSidebar === 'false');
  }, []);

  const onBuyMeACoffee = () => {
    window.open('https://coff.ee/binhle', '_blank');
  };

  const onSelectCategory = (category: string) => {
    setActiveCategory(category);
    setSearchParams({ c: category });
    // Close mobile drawer when selecting a category
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
      localStorage.setItem(LOCAL_STORAGE_KEY.CONFIG.EXPAND_SIDEBAR, collapsed.toString());
    }
  };

  const renderSidebarContent = () => (
    <Flex vertical className='h-full!'>
      {/* Logo Section */}
      <Flex
        align='center'
        justify={isMobile ? 'flex-start' : 'center'}
        gap={collapsed && !isMobile ? 0 : 12}
        className='cursor-pointer py-4! px-3!'
      >
        <div className='relative'>
          <img src={'/logo/logo.webp'} alt='Utilee' className='w-11 h-11 rounded-xl' />
          <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/10 pointer-events-none' />
        </div>
        {(!collapsed || isMobile) && (
          <Title level={3} className='m-0! text-gradient-orange font-bold!'>
            Utilee
          </Title>
        )}
      </Flex>

      <Divider className='my-2! mt-0! border-[var(--border-default)]!' />

      {(!collapsed || isMobile) && (
        <Text className='text-[var(--text-tertiary)]! text-xs! px-4! pt-2! font-semibold! uppercase! tracking-wider!'>
          Categories
        </Text>
      )}

      <Flex vertical gap={4} className='pt-2! px-3! flex-1!'>
        {categoryKeys.map((category) => {
          const tool = tools[category];
          const isActive = activeCategory === category;

          return (
            <Flex
              key={category}
              align='center'
              gap={collapsed && !isMobile ? 0 : 12}
              justify={collapsed && !isMobile ? 'center' : 'flex-start'}
              className={`
                cursor-pointer rounded-xl! p-3! transition-all duration-300!
                ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-500/30!'
                    : 'hover:bg-[var(--bg-hover)]! border border-transparent!'
                }
              `}
              onClick={() => onSelectCategory(category)}
              title={collapsed && !isMobile ? tool.label : undefined}
            >
              <span className={`${isActive ? 'text-orange-400!' : 'text-[var(--text-secondary)]!'}`}>{tool.icon}</span>
              {(!collapsed || isMobile) && (
                <Text
                  className={`
                    text-sm! font-medium! transition-colors duration-200!
                    ${isActive ? 'text-orange-400!' : 'text-[var(--text-secondary)]! hover:text-[var(--text-primary)]!'}
                  `}
                >
                  {tool.label}
                </Text>
              )}
            </Flex>
          );
        })}

        <div className='flex-1!'></div>

        {/* Collapse button */}
        <Flex
          align='center'
          gap={collapsed && !isMobile ? 0 : 12}
          justify={collapsed && !isMobile ? 'center' : 'flex-start'}
          className='cursor-pointer hover:bg-[var(--bg-hover)]! rounded-xl! p-3! transition-all duration-300! border border-transparent!'
          onClick={toggleSidebar}
          title={collapsed && !isMobile ? 'Expand Sidebar' : undefined}
        >
          <IconLayoutSidebar className='text-[var(--text-secondary)]!' size={20} />
          {(!collapsed || isMobile) && (
            <Text className='text-sm! text-[var(--text-secondary)]! font-medium!'>
              {collapsed ? 'Expand' : 'Collapse'}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );

  return (
    <Layout className='min-h-screen! animated-bg overflow-x-hidden!'>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          className='bg-[var(--bg-surface)]! border-r border-[var(--border-default)]! pb-4 fixed! left-0! top-0! bottom-0! h-screen! z-100!'
          collapsed={collapsed}
          collapsedWidth={80}
          width={260}
          trigger={null}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {renderSidebarContent()}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title={null}
          placement='left'
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          width='100%'
          height='100%'
          className='mobile-drawer!'
          styles={{
            header: {
              display: 'none'
            },
            body: {
              backgroundColor: 'var(--bg-surface)',
              height: '100vh',
              overflow: 'hidden',
              padding: 0
            }
          }}
        >
          <div className='bg-[var(--bg-surface)]! h-full! relative!'>
            <Button
              type='text'
              icon={<CloseOutlined />}
              onClick={() => setMobileDrawerOpen(false)}
              className='absolute! top-4! right-4! z-10! text-[var(--text-secondary)]! hover:text-orange-400!'
              size='small'
            />

            {renderSidebarContent()}
          </div>
        </Drawer>
      )}

      <Layout
        className='bg-transparent! transition-all duration-300'
        style={{ marginLeft: !isMobile ? (collapsed ? 80 : 260) : 0 }}
      >
        {/* Mobile Header with Hamburger */}
        {isMobile && (
          <div className='bg-[var(--bg-elevated)]! border-b border-[var(--border-default)]! px-4! py-3! flex! items-center! justify-between!'>
            <Button
              type='primary'
              icon={<MenuOutlined />}
              onClick={toggleSidebar}
              className='flex! items-center! justify-center!'
            />
            <Flex align='center' gap={10}>
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-9 h-9 rounded-xl' />
              <Title level={4} className='m-0! text-gradient-orange font-bold!'>
                Utilee
              </Title>
            </Flex>
            <div className='w-10'></div>
          </div>
        )}

        <Content className='p-0 w-full bg-transparent! flex-1 overflow-x-hidden!'>
          <Container className='w-full flex'>
            <Outlet />
          </Container>
        </Content>

        <Footer className='px-0! py-5! bg-[var(--bg-elevated)]! border-t border-[var(--border-default)]!'>
          <Container>
            <Flex
              justify={isMobile ? 'center' : 'space-between'}
              align='center'
              gap={isMobile ? 16 : 0}
              vertical={isMobile}
            >
              <Text className='text-[var(--text-secondary)]!'>
                ©2025 Created by{' '}
                <a
                  href='https://github.com/binhle3920'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-orange-400! font-semibold! hover:text-orange-300! transition-all duration-300! underline underline-offset-2!'
                >
                  Binh Le
                </a>
              </Text>

              {/* Buy me a coffee button */}
              <button
                className='group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] active:scale-95'
                onClick={onBuyMeACoffee}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                <Flex justify='center' align='center' gap={8} className='relative z-10'>
                  <IconCoffee
                    stroke={2.5}
                    size={18}
                    className='text-white drop-shadow-sm transition-transform duration-300 group-hover:rotate-12'
                  />
                  <Text className='text-white! font-bold! text-sm! tracking-wide! drop-shadow-sm!'>
                    Buy me a Coffee
                  </Text>
                </Flex>
              </button>
            </Flex>
          </Container>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
