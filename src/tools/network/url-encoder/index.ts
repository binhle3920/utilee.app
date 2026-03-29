import { UrlEncoder } from './UrlEncoder'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'url-encoder',
  name: 'URL Encoder/Decoder',
  description: 'Encode or decode URLs and URI components with real-time conversion.',
  category: 'network',
  icon: '🔗',
  component: UrlEncoder,
  keywords: ['url', 'encode', 'decode', 'percent', 'uri'],
}
