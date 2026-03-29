import type { ToolDefinition } from '../../types'
import { CaseConverter } from './CaseConverter'

export const toolDef: ToolDefinition = {
  slug: 'case-converter',
  name: 'Case Converter',
  description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
  category: 'text-writing',
  icon: '🔤',
  component: CaseConverter,
  keywords: ['uppercase', 'lowercase', 'title', 'camel', 'snake', 'case'],
}
