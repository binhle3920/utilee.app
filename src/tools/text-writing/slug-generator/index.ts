import type { ToolDefinition } from '../../types'
import { SlugGenerator } from './SlugGenerator'

export const toolDef: ToolDefinition = {
  slug: 'slug-generator',
  name: 'Slug Generator',
  description: 'Generate URL-friendly slugs from any text with customizable options.',
  category: 'text-writing',
  icon: '🔗',
  component: SlugGenerator,
  keywords: ['slug', 'url', 'friendly', 'permalink', 'seo'],
}
