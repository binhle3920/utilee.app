import type { ToolDefinition } from '../../types'
import { HashGenerator } from './HashGenerator'

export const toolDef: ToolDefinition = {
  slug: 'hash-generator',
  name: 'Hash Generator',
  description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text input.',
  category: 'generators',
  icon: '#️⃣',
  component: HashGenerator,
  keywords: ['hash', 'md5', 'sha', 'sha256', 'checksum'],
}
