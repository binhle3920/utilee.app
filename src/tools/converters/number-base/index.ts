import type { ToolDefinition } from '../../types'
import { NumberBase } from './NumberBase'

export const toolDef: ToolDefinition = {
  slug: 'number-base',
  name: 'Number Base Converter',
  description: 'Convert numbers between binary, octal, decimal, and hexadecimal.',
  category: 'converters',
  icon: '🔢',
  component: NumberBase,
  keywords: ['decimal', 'hex', 'octal', 'binary', 'base'],
}
