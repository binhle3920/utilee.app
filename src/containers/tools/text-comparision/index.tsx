import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

const TextComparisonScreen = () => {
  const onClearAll = () => {
    console.log('clear all');
  };

  const onCompare = () => {
    console.log('compare');
  };

  return (
    <>
      <SEO
        title='Text Comparison - Utilee'
        description='Compare two texts and see the difference between them.'
        keywords='text comparison, text difference, text similarity, text diff, text compare'
        url={`${APP_BASE_URL}/${Route.TOOLS.TEXT_COMPARISION}`}
      />

      <ToolLayout
        actions={[
          <Button key='compare' type='primary' onClick={onCompare}>
            Compare
          </Button>,
          <Tooltip title='Clear all' key='clear-all'>
            <Button type='default' shape='circle' icon={<DeleteOutlined />} onClick={onClearAll} />
          </Tooltip>
        ]}
      ></ToolLayout>
    </>
  );
};

export default TextComparisonScreen;
