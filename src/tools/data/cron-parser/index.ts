import type { ToolDefinition } from '../../types'
import { CronParser } from './CronParser'

export const toolDef: ToolDefinition = {
  slug: 'cron-parser',
  name: 'Cron Expression Parser',
  description: 'Parse cron expressions into human-readable schedules with next execution times.',
  category: 'data',
  icon: '⏰',
  component: CronParser,
  keywords: ['cron', 'schedule', 'timer', 'expression'],
}
