import { FontSizeOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Flex, Input, Typography, ColorPicker } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';

import Container from '../../../components/container';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/local-storage';
import Route from '../../../utils/constants/route';
import './index.css';

const ToolsNoteScreen = () => {
  const [countingType, setCountingType] = useState<'words' | 'characters'>('words');
  const [note, setNote] = useState<string>('');
  const [length, setLength] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(20);
  const [color, setColor] = useState<string>('#000000');

  const navigate = useNavigate();

  useDebounce(
    () => {
      if (note) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.NOTE,
          JSON.stringify({
            note,
            fontSize,
            countingType,
            color
          })
        );
      }
    },
    500,
    [note, fontSize, countingType, color]
  );

  // Get the note from local storage
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY.NOTE);
    if (data) {
      const { note, fontSize, countingType, color } = JSON.parse(data);
      setNote(note);
      setFontSize(fontSize);
      setCountingType(countingType);
      if (color) setColor(color);
    }
  }, []);

  // Count the number of words in the note
  useEffect(() => {
    if (note) {
      setLength(note.split(' ').length);
    } else {
      setLength(0);
    }
  }, [note]);

  const onCountingTypeChange = () => {
    setCountingType(countingType === 'words' ? 'characters' : 'words');
  };

  return (
    <Container className='py-4'>
      <Flex justify='space-between' align='center' gap={8}>
        <Button type='primary' icon={<HomeOutlined />} size='large' onClick={() => navigate(Route.DASHBOARD)} />

        <Flex align='center' gap={8}>
          <Button onClick={onCountingTypeChange} type='text'>
            <Typography.Text>
              {countingType === 'words' ? length : note.length} {countingType}
            </Typography.Text>
          </Button>

          <Dropdown
            menu={{
              items: [
                { key: '16', label: 'Small' },
                { key: '20', label: 'Medium' },
                { key: '28', label: 'Large' },
                { key: '36', label: 'Extra Large' }
              ],
              onClick: ({ key }) => setFontSize(Number(key))
            }}
            placement='bottomRight'
          >
            <Button icon={<FontSizeOutlined />}>
              <Typography.Text>{fontSize}px</Typography.Text>
            </Button>
          </Dropdown>

          <ColorPicker value={color} onChange={(_, hex) => setColor(hex)} />
        </Flex>
      </Flex>

      <Flex className='w-full' justify='center' align='center'>
        <div className='max-w-[800px] w-full'>
          <Input.TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={10}
            className='mt-4!'
            placeholder='Write your note here...'
            autoSize
            style={{ fontSize, minHeight: fontSize * 10 * 1.5, color }}
          />
        </div>
      </Flex>
    </Container>
  );
};

export default ToolsNoteScreen;
