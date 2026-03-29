import type { ToolDefinition } from '../../types'
import { ColorConverter } from './ColorConverter'

export const toolDef: ToolDefinition = {
  slug: 'color-converter',
  name: 'Color Converter',
  description: 'Convert colors between HEX, RGB, and HSL formats with a live preview.',
  category: 'converters',
  icon: '🎨',
  component: ColorConverter,
  keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'],
}
