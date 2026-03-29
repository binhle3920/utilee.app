import type { ToolDefinition } from '../../types'
import { UuidGenerator } from './UuidGenerator'

export const toolDef: ToolDefinition = {
  slug: 'uuid-generator',
  name: 'UUID Generator',
  description: 'Generate random UUIDs (v4) in bulk with formatting options.',
  category: 'generators',
  icon: '🆔',
  component: UuidGenerator,
  keywords: ['uuid', 'guid', 'unique', 'id'],
}
