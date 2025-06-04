import { HomeOutlined } from '@ant-design/icons';
import { Button, Flex, Layout } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '../../../components/container';
import Route from '../../../utils/constants/route';

interface IProps {
  children?: ReactNode;
  actions?: ReactNode[];
}

const ToolLayout = (props: IProps) => {
  const { children, actions } = props;
  const navigate = useNavigate();

  return (
    <Layout className='h-screen'>
      <Layout.Header className='p-0! bg-white! border-b border-gray-200! flex'>
        <Container>
          <Flex justify='space-between' align='center'>
            <Button type='primary' icon={<HomeOutlined />} size='large' onClick={() => navigate(Route.DASHBOARD)} />

            {actions?.map((action, index) => <div key={index}>{action}</div>)}
          </Flex>
        </Container>
      </Layout.Header>
      <Layout.Content className='p-0 w-full bg-white!'>
        <Container className='w-full overflow-scroll mt-4 pb-8'>{children}</Container>
      </Layout.Content>
    </Layout>
  );
};

export default ToolLayout;
