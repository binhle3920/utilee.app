import { HttpStatus } from './HttpStatus'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'http-status',
  name: 'HTTP Status Codes',
  description: 'Searchable reference of all standard HTTP status codes with descriptions.',
  category: 'network',
  icon: '📡',
  component: HttpStatus,
  keywords: ['http', 'status', 'code', 'response', 'api'],
}
