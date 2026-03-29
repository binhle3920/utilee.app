import { UserAgentParser } from './UserAgentParser'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'user-agent',
  name: 'User Agent Parser',
  description: 'Parse user agent strings to identify browser, OS, device, and engine.',
  category: 'network',
  icon: '🖥️',
  component: UserAgentParser,
  keywords: ['user', 'agent', 'browser', 'os', 'device', 'ua'],
}
