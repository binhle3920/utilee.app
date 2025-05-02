import { Card, Flex, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import tools from '../../utils/constants/tools';

const DashboardScreen = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Flex align='center' vertical className='h-full w-full gap-8 mt-8! mb-8!'>
      {Object.values(tools).map((tool) => (
        <Card
          key={tool.title}
          onClick={() => handleNavigate(tool.path)}
          className='cursor-pointer w-100'
          cover={<Image src={tool.image} alt='Note' preview={false} />}
        >
          <Typography.Title level={2}>{tool.title}</Typography.Title>
          <Typography.Paragraph className='text-gray-500!'>{tool.description}</Typography.Paragraph>
        </Card>
      ))}
    </Flex>
  );
};

export default DashboardScreen;
