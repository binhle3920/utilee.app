import type { ToolDefinition } from '../../types'
import { CsvJson } from './CsvJson'

export const toolDef: ToolDefinition = {
  slug: 'csv-json',
  name: 'CSV \u2194 JSON',
  description: 'Convert between CSV and JSON formats. Handles quoted fields and commas.',
  category: 'converters',
  icon: '📊',
  component: CsvJson,
  keywords: ['csv', 'json', 'convert', 'table'],
}
