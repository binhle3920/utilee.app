import { IpInfo } from './IpInfo'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'ip-info',
  name: 'IP Address Info',
  description: 'Display your public IP address, location, and network details.',
  category: 'network',
  icon: '🌐',
  component: IpInfo,
  keywords: ['ip', 'address', 'location', 'geo', 'network', 'public'],
}
