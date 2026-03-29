import type { ToolDefinition } from '../../types'
import { MarkdownPreview } from './MarkdownPreview'

export const toolDef: ToolDefinition = {
  slug: 'markdown-preview',
  name: 'Markdown Preview',
  description: 'Write Markdown on the left and see a live rendered preview on the right.',
  category: 'text-writing',
  icon: '📄',
  component: MarkdownPreview,
  keywords: ['markdown', 'preview', 'render', 'md'],
}
