import type { ToolDefinition } from '../../types'
import { JwtDecoder } from './JwtDecoder'

export const toolDef: ToolDefinition = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  description: 'Decode and inspect JSON Web Tokens with claim analysis.',
  category: 'data',
  icon: '🎟️',
  component: JwtDecoder,
  keywords: ['jwt', 'token', 'decode', 'json', 'web', 'token'],
}
