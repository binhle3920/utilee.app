import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Input, InputNumber, Typography } from 'antd';
import { loremIpsum } from 'lorem-ipsum';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '../../../components/container';
import Route from '../../../utils/constants/route';

const LoremIpsumGeneratorScreen = () => {
  const [count, setCount] = useState<number>(1);
  const [units, setUnits] = useState<'paragraph' | 'sentence' | 'word'>('paragraph');
  const [note, setNote] = useState<string>('');

  const navigate = useNavigate();

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

  return (
    <Container className='py-4'>
      <Flex className='justify-between items-center'>
        <Button type='primary' icon={<HomeOutlined />} size='large' onClick={() => navigate(Route.DASHBOARD)} />

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
        </Flex>
      </Flex>

      <Input.TextArea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={10}
        className='mt-4!'
        autoSize
        style={{ fontSize: 16, minHeight: 16 * 10 * 1.5, color: '#111' }}
      />
    </Container>
  );
};

export default LoremIpsumGeneratorScreen;
