import type { ToolDefinition } from '../../types'
import { PasswordGenerator } from './PasswordGenerator'

export const toolDef: ToolDefinition = {
  slug: 'password-generator',
  name: 'Password Generator',
  description: 'Generate secure random passwords with customizable length and character sets.',
  category: 'generators',
  icon: '🔑',
  component: PasswordGenerator,
  keywords: ['password', 'random', 'secure', 'generate'],
}
