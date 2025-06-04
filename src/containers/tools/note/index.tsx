import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Typography } from 'antd';
import { useEffect, useState } from 'react';

import './index.css';
import ToolLayout from '../../../components/layouts/tool-layout';
import SEO from '../../../components/SEO';
import { APP_BASE_URL } from '../../../utils/constants/app';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/local-storage';
import Route from '../../../utils/constants/route';

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
    <>
      <SEO
        title='Free Online Note Taking Tool - DEV Utilities'
        description='Simple, fast, and free note-taking tool with word/character counter. Perfect for developers, writers, and students. Auto-saves to local storage. No registration required.'
        keywords='note taking tool, free notes app, online notepad, text editor, word counter, character counter, developer notes, quick notes'
        url={`${APP_BASE_URL}/${Route.TOOLS.NOTE}`}
      />

      <ToolLayout
        actions={[
          <Button onClick={onCountingTypeChange} type='default'>
            <Typography.Text>
              {countingType === 'words' ? length : (editor?.getText().length ?? 0)} {countingType}
            </Typography.Text>
          </Button>
        ]}
      >
        <EditorContent editor={editor} className='w-full h-full' />
      </ToolLayout>
    </>
  );
};

export default ToolsNoteScreen;
