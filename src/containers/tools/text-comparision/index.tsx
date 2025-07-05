import { DeleteOutlined, EditOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Flex, Input, message, Tooltip } from 'antd';
import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

const { TextArea } = Input;

const TextComparisonScreen = () => {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [showDiff, setShowDiff] = useState<boolean>(false);

  const onClearAll = () => {
    setText1('');
    setText2('');
    setShowDiff(false);
  };

  const onCompare = () => {
    if (!text1 || !text2) {
      message.warning('Please enter both texts');
      return;
    }

    setShowDiff(true);
  };

  const onSwitchText = () => {
    const secondText = text2;
    setText2(text1);
    setText1(secondText);
  };

  const renderActions = () => {
    const actions = [];
    actions.push(
      <Flex gap={8} key='switch-text-and-clear' align='center'>
        <Button icon={<SwapOutlined />} onClick={onSwitchText}>
          Switch Text
        </Button>
        <Tooltip title='Clear all'>
          <Button type='default' shape='circle' icon={<DeleteOutlined />} onClick={onClearAll} />
        </Tooltip>
      </Flex>
    );

    if (!showDiff) {
      actions.unshift(
        <Button key='compare' icon={<SearchOutlined />} type='primary' onClick={onCompare}>
          Compare
        </Button>
      );
    } else {
      actions.unshift(
        <Button key='edit' icon={<EditOutlined />} type='primary' onClick={() => setShowDiff(false)}>
          Back to Edit
        </Button>
      );
    }

    return actions;
  };

  return (
    <>
      <SEO
        title='Text Comparison - Utilee'
        description='Compare two texts and see the difference between them.'
        keywords='text comparison, text difference, text similarity, text diff, text compare'
        url={`${APP_BASE_URL}/${Route.TOOLS.TEXT_COMPARISON}`}
      />

      <ToolLayout actions={renderActions()}>
        <div className='mt-6'>
          {showDiff ? (
            <ReactDiffViewer
              oldValue={text1}
              newValue={text2}
              splitView={true}
              styles={{
                wordDiff: {
                  display: 'inline'
                }
              }}
            />
          ) : (
            <Flex gap={16}>
              <TextArea
                className='flex-1'
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder='Text 1'
                autoSize={{ minRows: 20 }}
              />
              <TextArea
                className='flex-1'
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder='Text 2'
                autoSize={{ minRows: 20 }}
              />
            </Flex>
          )}
        </div>
      </ToolLayout>
    </>
  );
};

export default TextComparisonScreen;
