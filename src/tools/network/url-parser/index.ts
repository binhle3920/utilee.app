import { UrlParser } from './UrlParser'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'url-parser',
  name: 'URL Parser',
  description: 'Parse URLs into their components and extract query parameters.',
  category: 'network',
  icon: '🌐',
  component: UrlParser,
  keywords: ['url', 'parse', 'query', 'string', 'path'],
}
