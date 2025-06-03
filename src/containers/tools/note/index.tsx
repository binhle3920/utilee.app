import { HomeOutlined } from '@ant-design/icons';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Divider, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '../../../components/container';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/local-storage';
import Route from '../../../utils/constants/route';
import './index.css';

// Extensions array
const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: 'Write something...'
  })
];

const ToolsNoteScreen = () => {
  const [countingType, setCountingType] = useState<'words' | 'characters'>('words');
  const [length, setLength] = useState<number>(0);

  const navigate = useNavigate();

  const editor = useEditor({
    extensions,
    editable: true,
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg focus:outline-none min-w-full'
      }
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      localStorage.setItem(
        LOCAL_STORAGE_KEY.NOTE,
        JSON.stringify({
          note: content,
          countingType
        })
      );
    }
  });

  // Get the note from local storage
  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY.NOTE);
    if (data) {
      const { note, countingType: savedCountingType } = JSON.parse(data);
      editor?.commands.setContent(note);
      setCountingType(savedCountingType);
    }
  }, [editor]);

  // Count the number of words in the note
  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      if (text) {
        setLength(text.split(/\s+/).filter((word) => word.length > 0).length);
      } else {
        setLength(0);
      }
    }
  }, [editor?.getHTML()]);

  const onCountingTypeChange = () => {
    setCountingType(countingType === 'words' ? 'characters' : 'words');
  };

  return (
    <Container className='py-4'>
      <Flex justify='space-between' align='center' gap={8}>
        <Button type='primary' icon={<HomeOutlined />} size='large' onClick={() => navigate(Route.DASHBOARD)} />

        <Flex align='center' gap={8}>
          <Button onClick={onCountingTypeChange} type='default'>
            <Typography.Text>
              {countingType === 'words' ? length : (editor?.getText().length ?? 0)} {countingType}
            </Typography.Text>
          </Button>
        </Flex>
      </Flex>

      <Divider />

      <EditorContent editor={editor} className='w-full h-full' />
    </Container>
  );
};

export default ToolsNoteScreen;
