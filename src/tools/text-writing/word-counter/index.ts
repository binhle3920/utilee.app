import { WordCounter } from './WordCounter'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'word-counter',
  name: 'Word & Character Counter',
  description: 'Count words, characters, sentences, and paragraphs with reading time estimates.',
  category: 'text-writing',
  icon: '🔢',
  component: WordCounter,
  keywords: ['word', 'character', 'count', 'letter', 'sentence', 'paragraph', 'reading time'],
}
