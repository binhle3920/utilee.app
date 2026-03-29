import type { ToolDefinition } from '../../types'
import { SqlFormatter } from './SqlFormatter'

export const toolDef: ToolDefinition = {
  slug: 'sql-formatter',
  name: 'SQL Formatter',
  description: 'Format and beautify SQL queries with keyword highlighting.',
  category: 'data',
  icon: '🗃️',
  component: SqlFormatter,
  keywords: ['sql', 'format', 'query', 'beautify', 'database'],
}
