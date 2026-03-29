import type { ToolDefinition } from '../../types'
import { TextDiff } from './TextDiff'

export const toolDef: ToolDefinition = {
  slug: 'text-diff',
  name: 'Text Diff',
  description: 'Compare two texts side by side and highlight the differences between them.',
  category: 'text-writing',
  icon: '🔀',
  component: TextDiff,
  keywords: ['diff', 'compare', 'difference', 'merge'],
}
