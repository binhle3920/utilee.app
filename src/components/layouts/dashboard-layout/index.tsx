import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { IconCoffee, IconLayoutSidebar } from '@tabler/icons-react';
import { Flex, Layout, Tag, Typography, Button, Drawer, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import Container from '@/components/container';
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
    console.log('expandSidebar', localStorage.getItem(LOCAL_STORAGE_KEY.CONFIG.EXPAND_SIDEBAR));
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
      <Flex
        align='center'
        justify={isMobile ? 'flex-start' : 'center'}
        gap={collapsed && !isMobile ? 0 : 8}
        className='cursor-pointer py-2! px-2!'
      >
        <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
        {(!collapsed || isMobile) && (
          <Title level={3} className='m-0!'>
            Utilee
          </Title>
        )}
      </Flex>

      <Divider className='my-2! mt-0!' />

      {(!collapsed || isMobile) && (
        <Text className='text-gray-500! text-md! px-[8px]! pt-2! font-medium!'>Categories</Text>
      )}

      <Flex vertical gap={2} className='pt-1! px-2! flex-1!'>
        {categoryKeys.map((category) => {
          const tool = tools[category];

          return (
            <Flex
              key={category}
              align='center'
              gap={collapsed && !isMobile ? 0 : 8}
              justify={collapsed && !isMobile ? 'center' : 'flex-start'}
              className={`cursor-pointer hover:bg-gray-200! rounded-md! p-2! transition-all duration-300! ${
                activeCategory === category ? 'bg-gray-200!' : ''
              }`}
              onClick={() => onSelectCategory(category)}
              title={collapsed && !isMobile ? tool.label : undefined}
            >
              {tool.icon}
              {(!collapsed || isMobile) && (
                <Text className={`text-sm! text-gray-700! ${activeCategory === category ? 'text-gray-900!' : ''}`}>
                  {tool.label}
                </Text>
              )}
            </Flex>
          );
        })}
        <div className='flex-1!'></div>
        <Flex
          align='center'
          gap={collapsed && !isMobile ? 0 : 8}
          justify={collapsed && !isMobile ? 'center' : 'flex-start'}
          className='cursor-pointer hover:bg-gray-200! rounded-md! p-2! transition-all duration-300!'
          onClick={toggleSidebar}
          title={collapsed && !isMobile ? 'Collapse' : undefined}
        >
          <IconLayoutSidebar />
          {(!collapsed || isMobile) && <Text className='text-sm! text-gray-700!'>Collapse</Text>}
        </Flex>{' '}
      </Flex>
    </Flex>
  );

  return (
    <Layout className='min-h-screen!'>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          className='bg-gray-100! border-r-1 border-gray-200 sticky top-0 left-0 bottom-0 h-screen pb-4'
          collapsed={collapsed}
          collapsedWidth={80}
          width={250}
          trigger={null}
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
              backgroundColor: '#f5f5f5',
              height: '100vh',
              overflow: 'hidden',
              padding: 0
            }
          }}
        >
          <div className='bg-gray-100! h-full! relative!'>
            <Button
              type='text'
              icon={<CloseOutlined />}
              onClick={() => setMobileDrawerOpen(false)}
              className='absolute! top-4! right-4! z-10!'
              size='small'
            />

            {renderSidebarContent()}
          </div>
        </Drawer>
      )}

      <Layout>
        {/* Mobile Header with Hamburger */}
        {isMobile && (
          <div className='bg-white! border-b-1! border-gray-200! px-4! py-3! flex! items-center! justify-between!'>
            <Button
              type='primary'
              icon={<MenuOutlined />}
              onClick={toggleSidebar}
              className='flex! items-center! justify-center!'
            />
            <Flex align='center' gap={8}>
              <img src={'/logo/logo.webp'} alt='Utilee' className='w-8 h-8 rounded-full' />
              <Title level={4} className='m-0!'>
                Utilee
              </Title>
            </Flex>
            <div className='w-10'></div>
          </div>
        )}

        <Content className='p-0 w-full bg-white! flex-1'>
          <Container className='w-full overflow-scroll flex'>
            <Outlet />
          </Container>
        </Content>

        <Footer className='px-0! py-4! bg-white! border-t-1! border-gray-200!'>
          <Container>
            <Flex
              justify={isMobile ? 'center' : 'space-between'}
              align='center'
              gap={isMobile ? 16 : 0}
              vertical={isMobile}
            >
              <Text>
                ©2025 Created by{' '}
                <a
                  href='https://github.com/binhle3920'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-700! font-bold! hover:text-gray-900! transition-all duration-300! underline!'
                >
                  Binh Le
                </a>
              </Text>

              {/* Buy me a coffee button */}
              <Tag
                className='cursor-pointer bg-[#fe8140]! border-[#e5743a]! border-2! text-white! transition-all duration-300! py-1! hover:bg-[#e5743a]!'
                onClick={onBuyMeACoffee}
              >
                <Flex justify='center' align='center' gap={4}>
                  <IconCoffee stroke={2} /> <Text className='text-white! font-medium!'>Buy me a Coffee</Text>
                </Flex>
              </Tag>
            </Flex>
          </Container>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
