import { CopyOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Flex, Input, InputNumber, Typography } from 'antd';
import { loremIpsum } from 'lorem-ipsum';
import { useEffect, useState } from 'react';

import ToolLayout from '@/components/layouts/tool-layout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

const { Title, Text } = Typography;

const LoremIpsumGeneratorScreen = () => {
  const [count, setCount] = useState<number>(1);
  const [units, setUnits] = useState<'paragraph' | 'sentence' | 'word'>('paragraph');
  const [note, setNote] = useState<string>('');

  const { message } = App.useApp();

  useEffect(() => {
    setNote(
      loremIpsum({
        count, // Number of "words", "sentences", or "paragraphs"
        format: 'plain', // "plain" or "html"
        paragraphLowerBound: 3, // Min. number of sentences per paragraph.
        paragraphUpperBound: 7, // Max. number of sentences per paragarph.
        random: Math.random, // A PRNG function
        sentenceLowerBound: 5, // Min. number of words per sentence.
        sentenceUpperBound: 15, // Max. number of words per sentence.
        suffix: '\n', // Line ending, defaults to "\n" or "\r\n" (win32)
        units: units // paragraph(s), "sentence(s)", or "word(s)"
      })
    );
  }, [count, units]);

  const onCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(note);
      message.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      message.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <SEO
        title='Free Lorem Ipsum Generator - Utilee'
        description='Generate Lorem Ipsum placeholder text instantly. Choose paragraphs, sentences, or words. Perfect for designers, developers, and content creators. Free and easy to use.'
        keywords='lorem ipsum generator, placeholder text, dummy text, filler text, design placeholder, web development, content placeholder, fake text generator'
        url={`${APP_BASE_URL}/${Route.TOOLS.LOREM_GENERATOR}`}
      />

      <ToolLayout
        actions={[
          <Flex className='justify-end items-center' gap={8}>
            <InputNumber type='number' min={1} max={100} value={count} onChange={(value) => setCount(value ?? 1)} />
            <Dropdown
              menu={{
                items: [
                  { key: 'paragraph', label: 'Paragraph' },
                  { key: 'sentence', label: 'Sentence' },
                  { key: 'word', label: 'Word' }
                ],
                onClick: ({ key }) => setUnits(key as 'paragraph' | 'sentence' | 'word')
              }}
              placement='bottomRight'
            >
              <Button icon={<UnorderedListOutlined />}>
                <Typography.Text>{units.charAt(0).toUpperCase() + units.slice(1)}</Typography.Text>
              </Button>
            </Dropdown>
          </Flex>,
          <Button type='default' shape='circle' icon={<CopyOutlined />} onClick={onCopy} />
        ]}
      >
        <Flex justify='center' vertical>
          <Title level={2} className='mb-2!'>
            Lorem Ipsum Generator
          </Title>
          <Text type='secondary'>
            Generate Lorem Ipsum placeholder text instantly. Choose paragraphs, sentences, or words. Perfect for
            designers, developers, and content creators. Free and easy to use.
          </Text>
        </Flex>

        <div onClick={onCopy} className='mt-6'>
          <Input.TextArea
            value={note}
            rows={10}
            className='cursor-copy! bg-white! hover:text-gray-500!'
            autoSize
            style={{ fontSize: 16, minHeight: 16 * 10 * 1.5, color: '#111' }}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default LoremIpsumGeneratorScreen;
