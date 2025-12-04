import { IconArrowRight } from '@tabler/icons-react';
import { Card, Divider, Flex, Image, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import tools, { ToolsCollection } from '@/utils/constants/tools';

const { Title, Text } = Typography;

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get('c');
  const toolCategory = tools[activeCategory as keyof ToolsCollection];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <SEO
        title='Utilee - Free Developer Tools Collection'
        description='Access a comprehensive collection of free developer tools including image converter, lorem ipsum generator, note-taking app, and more productivity utilities for developers.'
        keywords='developer tools, free tools, image converter, lorem ipsum generator, note taking, developer utilities, web development tools, coding productivity'
        url={`${APP_BASE_URL}`}
      />

      {toolCategory && (
        <div className='py-6 w-full'>
          {/* Category Header */}
          <Flex vertical className='mb-8!'>
            <Title level={2} className='mb-1! text-[var(--text-primary)]! font-bold!'>
              <span className='text-gradient-orange'>{toolCategory.label}</span>
            </Title>
            <Text className='text-[var(--text-secondary)]! text-base!'>
              {Object.keys(toolCategory.tools).length} tools available — Select one to get started
            </Text>
          </Flex>

          {/* Tools Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
            {Object.values(toolCategory.tools).map((tool) => (
              <Card
                key={tool.title}
                hoverable
                onClick={() => handleNavigate(tool.path)}
                className='bg-[var(--bg-container)]! border-[var(--border-default)]! overflow-hidden group'
                styles={{
                  body: {
                    padding: 0
                  }
                }}
              >
                {/* Image Section */}
                <div className='relative bg-[var(--bg-spotlight)]! p-6 flex items-center justify-center overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    preview={false}
                    height={100}
                    className='transition-transform duration-300 group-hover:scale-105'
                  />
                </div>

                <Divider className='m-0! border-[var(--border-default)]!' />

                {/* Content Section */}
                <div className='p-5'>
                  <Flex vertical gap={8}>
                    <Flex justify='space-between' align='center'>
                      <Title level={4} className='m-0! text-[var(--text-primary)]! font-semibold!'>
                        {tool.title}
                      </Title>
                      <IconArrowRight
                        size={18}
                        className='text-[var(--text-tertiary)]! transition-all duration-300 group-hover:text-orange-400 group-hover:translate-x-1'
                      />
                    </Flex>
                    <Text className='text-[var(--text-tertiary)]! text-sm! leading-relaxed!'>{tool.description}</Text>
                  </Flex>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardScreen;
