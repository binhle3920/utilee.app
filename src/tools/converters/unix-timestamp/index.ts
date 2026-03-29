import type { ToolDefinition } from '../../types'
import { UnixTimestamp } from './UnixTimestamp'

export const toolDef: ToolDefinition = {
  slug: 'unix-timestamp',
  name: 'Unix Timestamp Converter',
  description: 'Convert between Unix timestamps and human-readable dates.',
  category: 'converters',
  icon: '⏱️',
  component: UnixTimestamp,
  keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'],
}
