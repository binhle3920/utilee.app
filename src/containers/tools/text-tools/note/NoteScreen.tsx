import { CopyOutlined } from '@ant-design/icons';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, message, Typography } from 'antd';
import { useEffect, useState } from 'react';

import ToolLayout from '@/components/layouts/ToolLayout';
import SEO from '@/components/SEO';
import { APP_BASE_URL } from '@/utils/constants/app';
import { LOCAL_STORAGE_KEY } from '@/utils/constants/local-storage';
import Route from '@/utils/constants/route';

import './utils/styles/index.css';

// Extensions array
const extensions = [
  StarterKit,
  TaskItem,
  TaskList,

  Placeholder.configure({
    placeholder: 'Start writing your notes...'
  })
];

const NoteScreen = () => {
  const [countingType, setCountingType] = useState<'words' | 'characters'>('words');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);

  const editor = useEditor({
    extensions,
    editable: true,
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm focus:outline-none min-w-full'
      }
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
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

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY.NOTE);
    if (data) {
      const { note, countingType: savedCountingType } = JSON.parse(data);
      editor?.commands.setContent(note);
      setCountingType(savedCountingType);
    }
  }, [editor]);

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

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(editor?.getText() ?? '');
      message.success('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      message.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className='note-tool-container'>
      <SEO
        title='Free Online Note Taking Tool - Utilee'
        description='Simple, fast, and free note-taking tool with word/character counter. Perfect for developers, writers, and students. Auto-saves to local storage. No registration required.'
        keywords='note taking tool, free notes app, online notepad, text editor, word counter, character counter, developer notes, quick notes'
        url={`${APP_BASE_URL}/${Route.TOOLS.NOTE}`}
      />

      <ToolLayout
        title='Note'
        actions={[
          <Button key='counting-type' onClick={onCountingTypeChange} type='default'>
            <Typography.Text className='text-[var(--text-secondary)]!'>
              {countingType === 'words' ? length : (editor?.getText().length ?? 0)} {countingType}
            </Typography.Text>
          </Button>,
          <Button key='copy' type='default' shape='circle' icon={<CopyOutlined />} onClick={onCopy} />
        ]}
      >
        <div
          className={`flex-1 rounded-xl bg-[var(--bg-container)] border p-6 overflow-auto transition-all ${isFocused ? 'border-[var(--border-light)] shadow-[0_0_0_2px_rgba(249,115,22,0.15)]' : 'border-[var(--border-default)]'}`}
        >
          <EditorContent editor={editor} className='w-full h-full' />
        </div>
      </ToolLayout>
    </div>
  );
};

export default NoteScreen;
