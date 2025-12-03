import { CopyOutlined, FormatPainterOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Flex, Typography } from 'antd';
import { useState } from 'react';

import StyledTextArea from '@/components/common/styled-textarea';
import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { useIsMobile } from '@/hooks/use-mobile';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

const JsonFormatterScreen = () => {
  const [inputJson, setInputJson] = useState<string>('');
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);

  const { message } = App.useApp();
  const isMobile = useIsMobile();

  const formatJson = () => {
    if (!inputJson.trim()) {
      message.warning('Please enter JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      message.success('JSON formatted successfully');
    } catch {
      message.error('Invalid JSON format');
    }
  };

  const minifyJson = () => {
    if (!inputJson.trim()) {
      message.warning('Please enter JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      message.success('JSON minified successfully');
    } catch {
      message.error('Invalid JSON format');
    }
  };

  const onCopy = async () => {
    if (!outputJson) {
      message.warning('No formatted JSON to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(outputJson);
      message.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      message.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <SEO
        title='Free JSON Formatter - Utilee'
        description='Format JSON data for better readability and structure.'
        keywords='json formatter, json, format, json beautifier, json minifier, json validator'
        url={`${APP_BASE_URL}/${Route.TOOLS.JSON_FORMATTER}`}
      />

      <ToolLayout
        title='JSON Formatter'
        description='Format and beautify JSON data for better readability and structure.'
        actions={[
          <Flex className='justify-end items-center' gap={8}>
            <Dropdown
              menu={{
                items: [
                  { key: '2', label: '2 spaces' },
                  { key: '4', label: '4 spaces' },
                  { key: '1', label: 'Tab' }
                ],
                onClick: ({ key }) => setIndentSize(Number(key))
              }}
              placement='bottomRight'
            >
              <Button icon={<UnorderedListOutlined />}>
                <Typography.Text>{indentSize === 1 ? 'Tab' : `${indentSize} spaces`}</Typography.Text>
              </Button>
            </Dropdown>
            <Button type='primary' icon={<FormatPainterOutlined />} onClick={formatJson}>
              Format
            </Button>
            <Button onClick={minifyJson}>Minify</Button>
          </Flex>,
          <Button type='default' shape='circle' icon={<CopyOutlined />} onClick={onCopy} />
        ]}
      >
        <Flex gap={16} className='flex-1 overflow-hidden' vertical={isMobile}>
          <div className='flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden'>
            <Typography.Text className='text-[var(--text-secondary)]! mb-2! block! text-sm! font-medium! shrink-0'>
              Input JSON
            </Typography.Text>
            <StyledTextArea
              variant='monospace'
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder='Paste your JSON here...'
              className='flex-1! h-full!'
            />
          </div>

          <div className='flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden'>
            <Typography.Text className='text-[var(--text-secondary)]! mb-2! block! text-sm! font-medium! shrink-0'>
              Formatted Output
            </Typography.Text>
            <StyledTextArea
              variant='readonly'
              value={outputJson}
              readOnly
              placeholder='Formatted JSON will appear here...'
              className='font-mono! flex-1! h-full!'
            />
          </div>
        </Flex>
      </ToolLayout>
    </>
  );
};

export default JsonFormatterScreen;
