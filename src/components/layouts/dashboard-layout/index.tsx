import { IconCoffee } from '@tabler/icons-react';
import { Flex, Layout, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import Container from '@/components/container';
import { useIsMobile } from '@/hooks/use-mobile';
import tools, { categoryKeys, ToolsCollection } from '@/utils/constants/tools';

const { Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const DashboardLayout = () => {
  const [activeCategory, setActiveCategory] = useState<keyof ToolsCollection>('');

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

  const onBuyMeACoffee = () => {
    window.open('https://coff.ee/binhle', '_blank');
  };

  const onSelectCategory = (category: string) => {
    setActiveCategory(category);
    setSearchParams({ c: category });
  };

  return (
    <Layout className='min-h-screen!'>
      <Sider className='bg-gray-100! border-r-1! border-gray-200!'>
        <Flex vertical className='h-full!'>
          <Flex align='center' justify='center' gap={8} className='cursor-pointer py-2! border-b-1! border-gray-200!'>
            <img src={'/logo/logo.webp'} alt='Utilee' className='w-10 h-10 rounded-full' />
            <Title level={3} className='m-0!'>
              Utilee
            </Title>
          </Flex>

          <Text className='text-gray-500! text-sm! px-4! pt-2'>Categories</Text>

          <Flex vertical gap={2} className='pt-1! px-2!'>
            {categoryKeys.map((category) => {
              const tool = tools[category];

              return (
                <Flex
                  key={category}
                  align='center'
                  gap={8}
                  className={`cursor-pointer hover:bg-gray-200! rounded-md! p-2! transition-all duration-300! ${
                    activeCategory === category ? 'bg-gray-200!' : ''
                  }`}
                  onClick={() => onSelectCategory(category)}
                >
                  {tool.icon}
                  <Text className={`text-sm! text-gray-700! ${activeCategory === category ? 'text-gray-900!' : ''}`}>
                    {tool.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Sider>

      <Layout>
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
                  className='text-gray-700! font-bold! hover:text-gray-900! transition-all duration-300!'
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
