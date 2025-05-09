import { Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import tools from '../../utils/constants/tools';

const DashboardScreen = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Row gutter={24} className='mt-8! mb-8! w-full' justify='center'>
      {Object.values(tools).map((tool) => (
        <Col xs={12} sm={12} md={8} lg={8} xl={6} key={tool.title}>
          <Card hoverable key={tool.title} onClick={() => handleNavigate(tool.path)} className='shadow-sm h-full'>
            <Flex vertical className='h-full' align='center' justify='center'>
              <Image src={tool.image} alt='Note' preview={false} height={100} />

              <Divider />

              <Flex vertical className='h-full w-full'>
                <Typography.Title level={4}>{tool.title}</Typography.Title>
                <Typography.Paragraph className='text-gray-400! text-sm!'>{tool.description}</Typography.Paragraph>
              </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardScreen;
