import { CopyOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, Flex, InputNumber, Typography } from 'antd';
import { loremIpsum } from 'lorem-ipsum';
import { useEffect, useState } from 'react';

import StyledTextArea from '@/components/common/StyledTextArea';
import ToolLayout from '@/components/layouts/ToolLayout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import Route from '@/utils/constants/route';

import { Units } from './utils/types';

const LoremIpsumGeneratorScreen = () => {
  const [count, setCount] = useState<number>(1);
  const [units, setUnits] = useState<Units>(Units.PARAGRAPH);
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

  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
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
        title='Lorem Ipsum Generator'
        actions={[
          <Flex className='justify-end items-center' gap={8}>
            <InputNumber
              type='number'
              min={1}
              max={100}
              value={count}
              onChange={(value) => setCount(value ?? 1)}
              className='w-20!'
            />
            <Dropdown
              menu={{
                items: [
                  { key: Units.PARAGRAPH, label: 'Paragraph' },
                  { key: Units.SENTENCE, label: 'Sentence' },
                  { key: Units.WORD, label: 'Word' }
                ],
                onClick: ({ key }) => setUnits(key as Units)
              }}
              placement='bottomRight'
            >
              <Button icon={<UnorderedListOutlined />}>
                <Typography.Text>{units.charAt(0).toUpperCase() + units.slice(1)}</Typography.Text>
              </Button>
            </Dropdown>
          </Flex>,
          <Button type='default' shape='circle' icon={<CopyOutlined />} onClick={handleCopy} />
        ]}
      >
        <StyledTextArea value={note} readOnly className='flex-1! h-full!' />
      </ToolLayout>
    </>
  );
};

export default LoremIpsumGeneratorScreen;
