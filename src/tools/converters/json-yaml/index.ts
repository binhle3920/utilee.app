import type { ToolDefinition } from '../../types'
import { JsonYaml } from './JsonYaml'

export const toolDef: ToolDefinition = {
  slug: 'json-yaml',
  name: 'JSON \u2194 YAML',
  description: 'Convert between JSON and YAML formats with no external dependencies.',
  category: 'converters',
  icon: '🔄',
  component: JsonYaml,
  keywords: ['json', 'yaml', 'convert'],
}
