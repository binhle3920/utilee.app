import type { ToolDefinition } from '../../types'
import { JsonFormatter } from './JsonFormatter'

export const toolDef: ToolDefinition = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format, minify, and validate JSON with statistics.',
  category: 'data',
  icon: '{ }',
  component: JsonFormatter,
  keywords: ['json', 'format', 'validate', 'pretty', 'minify'],
}
