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
        <div className='py-4 w-full'>
          <Flex vertical className='mb-4!'>
            <Title level={2} className='mb-0! text-gray-900!'>
              {toolCategory.label}
            </Title>
            <Text className='text-gray-500! text-sm!'>{Object.keys(toolCategory.tools).length} tools available</Text>
          </Flex>

          <div className='flex flex-wrap gap-4'>
            {Object.values(toolCategory.tools).map((tool) => (
              <Card
                key={tool.title}
                hoverable
                onClick={() => handleNavigate(tool.path)}
                className='min-w-[280px] flex-1 max-w-[320px]'
              >
                <Flex vertical align='center' justify='center'>
                  <Image src={tool.image} alt={tool.title} preview={false} height={100} />

                  <Divider />

                  <Flex vertical className='w-full'>
                    <Title level={4}>{tool.title}</Title>
                    <Text className='text-gray-400! text-sm!'>{tool.description}</Text>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardScreen;
