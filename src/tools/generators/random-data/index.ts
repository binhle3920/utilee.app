import type { ToolDefinition } from '../../types'
import { RandomDataGenerator } from './RandomDataGenerator'

export const toolDef: ToolDefinition = {
  slug: 'random-data',
  name: 'Random Data Generator',
  description: 'Generate random names, emails, phone numbers, addresses, and more.',
  category: 'generators',
  icon: '🎲',
  component: RandomDataGenerator,
  keywords: ['random', 'fake', 'mock', 'data', 'name', 'email'],
}
