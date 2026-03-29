import type { ToolDefinition } from '../../types'
import { RegexTester } from './RegexTester'

export const toolDef: ToolDefinition = {
  slug: 'regex-tester',
  name: 'Regex Tester',
  description: 'Test regular expressions with match highlighting and group capture.',
  category: 'data',
  icon: '🔍',
  component: RegexTester,
  keywords: ['regex', 'regular', 'expression', 'test', 'match', 'pattern'],
}
