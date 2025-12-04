import { DeleteOutlined, EditOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Flex, message, Tooltip } from 'antd';
import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import StyledTextArea from '@/components/common/StyledTextArea';
import ToolLayout from '@/components/layouts/ToolLayout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

import { darkDiffStyles } from './utils/constants';

const TextComparisonScreen = () => {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [showDiff, setShowDiff] = useState<boolean>(false);

  const handleClearAll = () => {
    setText1('');
    setText2('');
    setShowDiff(false);
  };

  const handleCompare = () => {
    if (!text1 || !text2) {
      message.warning('Please enter both texts');
      return;
    }

    setShowDiff(true);
  };

  const handleSwitchText = () => {
    const secondText = text2;
    setText2(text1);
    setText1(secondText);
  };

  const handleBackToEdit = () => {
    setShowDiff(false);
  };

  const renderActions = () => {
    const actions = [];
    actions.push(
      <Flex gap={8} key='switch-text-and-clear' align='center'>
        <Button icon={<SwapOutlined />} onClick={handleSwitchText}>
          Switch Text
        </Button>
        <Tooltip title='Clear all'>
          <Button type='default' shape='circle' icon={<DeleteOutlined />} onClick={handleClearAll} />
        </Tooltip>
      </Flex>
    );

    if (!showDiff) {
      actions.unshift(
        <Button key='compare' icon={<SearchOutlined />} type='primary' onClick={handleCompare}>
          Compare
        </Button>
      );
    } else {
      actions.unshift(
        <Button key='back-to-edit' icon={<EditOutlined />} type='primary' onClick={handleBackToEdit}>
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

      <ToolLayout title='Text Comparison' actions={renderActions()}>
        <div className='flex-1 flex flex-col'>
          {showDiff ? (
            <div className='rounded-xl overflow-auto border border-[var(--border-default)] flex flex-1'>
              <ReactDiffViewer
                oldValue={text1}
                newValue={text2}
                splitView={true}
                useDarkTheme={true}
                styles={darkDiffStyles}
              />
            </div>
          ) : (
            <Flex gap={16} className='flex-1'>
              <StyledTextArea
                className='flex-1 h-full!'
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder='Enter first text here...'
              />
              <StyledTextArea
                className='flex-1 h-full!'
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder='Enter second text here...'
              />
            </Flex>
          )}
        </div>
      </ToolLayout>
    </>
  );
};

export default TextComparisonScreen;
