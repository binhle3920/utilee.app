import type { ToolDefinition } from '../../types'
import { LoremIpsumGenerator } from './LoremIpsumGenerator'

export const toolDef: ToolDefinition = {
  slug: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  description: 'Generate placeholder Latin text in paragraphs, sentences, or words.',
  category: 'text-writing',
  icon: '📝',
  component: LoremIpsumGenerator,
  keywords: ['placeholder', 'latin', 'dummy', 'text', 'filler', 'copy'],
}
