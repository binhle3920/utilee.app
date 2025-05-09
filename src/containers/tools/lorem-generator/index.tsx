import { HomeOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

import Container from '../../../components/container';
import Route from '../../../utils/constants/route';

const LoremIpsumGeneratorScreen = () => {
  const navigate = useNavigate();

  return (
    <Container className='py-4'>
      <Flex>
        <Button type='primary' icon={<HomeOutlined />} size='large' onClick={() => navigate(Route.DASHBOARD)} />
      </Flex>
    </Container>
  );
};

export default LoremIpsumGeneratorScreen;
