import type { ToolDefinition } from '../../types'
import { Base64Tool } from './Base64Tool'

export const toolDef: ToolDefinition = {
  slug: 'base64',
  name: 'Base64 Encode/Decode',
  description: 'Encode text to Base64 or decode Base64 back to text.',
  category: 'converters',
  icon: '🔐',
  component: Base64Tool,
  keywords: ['base64', 'encode', 'decode'],
}
