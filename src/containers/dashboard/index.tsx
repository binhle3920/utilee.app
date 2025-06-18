import { Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import SEO from '../../components/SEO';
import { APP_BASE_URL } from '../../utils/constants/app';
import tools from '../../utils/constants/tools';

const DashboardScreen = () => {
  const navigate = useNavigate();

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

      <div className='py-8 w-full'>
        <Row gutter={0} justify='center'>
          {Object.values(tools).map((tool) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={tool.title} className='flex'>
              <Card
                hoverable
                key={tool.title}
                onClick={() => handleNavigate(tool.path)}
                className='w-full h-full rounded-none!'
              >
                <Flex vertical align='center' justify='center'>
                  <Image src={tool.image} alt='Note' preview={false} height={100} />

                  <Divider />

                  <Flex vertical className='w-full'>
                    <Typography.Title level={4}>{tool.title}</Typography.Title>
                    <Typography.Paragraph className='text-gray-400! text-sm!'>{tool.description}</Typography.Paragraph>
                  </Flex>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default DashboardScreen;
