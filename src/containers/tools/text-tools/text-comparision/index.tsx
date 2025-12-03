import { DeleteOutlined, EditOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Flex, message, Tooltip } from 'antd';
import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import StyledTextArea from '@/components/common/styled-textarea';
import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

// Dark theme styles for diff viewer
const darkDiffStyles = {
  variables: {
    dark: {
      diffViewerBackground: 'var(--bg-container)',
      diffViewerColor: 'var(--text-primary)',
      addedBackground: 'rgba(34, 197, 94, 0.15)',
      addedColor: '#4ade80',
      removedBackground: 'rgba(239, 68, 68, 0.15)',
      removedColor: '#f87171',
      wordAddedBackground: 'rgba(34, 197, 94, 0.3)',
      wordRemovedBackground: 'rgba(239, 68, 68, 0.3)',
      addedGutterBackground: 'rgba(34, 197, 94, 0.1)',
      removedGutterBackground: 'rgba(239, 68, 68, 0.1)',
      gutterBackground: 'var(--bg-spotlight)',
      gutterBackgroundDark: 'var(--bg-surface)',
      highlightBackground: 'rgba(249, 115, 22, 0.1)',
      highlightGutterBackground: 'rgba(249, 115, 22, 0.15)',
      codeFoldGutterBackground: 'var(--bg-spotlight)',
      codeFoldBackground: 'var(--bg-container)',
      emptyLineBackground: 'var(--bg-surface)',
      gutterColor: 'var(--text-tertiary)',
      addedGutterColor: '#4ade80',
      removedGutterColor: '#f87171',
      codeFoldContentColor: 'var(--text-secondary)',
      diffViewerTitleBackground: 'var(--bg-elevated)',
      diffViewerTitleColor: 'var(--text-primary)',
      diffViewerTitleBorderColor: 'var(--border-default)'
    }
  },
  wordDiff: {
    display: 'inline'
  },
  contentText: {
    fontFamily: "'Cousine', monospace",
    fontSize: '14px'
  },
  gutter: {
    minWidth: '40px',
    padding: '0 10px'
  },
  line: {
    padding: '2px 10px'
  }
};

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

      <ToolLayout
        title='Text Comparison'
        description='Compare two texts and see the difference between them.'
        actions={renderActions()}
      >
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
