import { ALL_TOOLS } from '@/tools/registry'
import { CATEGORY_ORDER, type ToolCategory, type ToolDefinition } from '@/tools/types'

export function getAllSlugs(): string[] {
  return ALL_TOOLS.map((t) => t.slug)
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug)
}

export function getToolsByCategory(): Map<ToolCategory, ToolDefinition[]> {
  const map = new Map<ToolCategory, ToolDefinition[]>()
  for (const category of CATEGORY_ORDER) {
    const tools = ALL_TOOLS.filter((t) => t.category === category)
    if (tools.length > 0) map.set(category, tools)
  }
  return map
}

export function getToolsByCategorySlug(category: ToolCategory): ToolDefinition[] {
  return ALL_TOOLS.filter((t) => t.category === category)
}

export function getAllCategorySlugs(): ToolCategory[] {
  return CATEGORY_ORDER.filter((c) => ALL_TOOLS.some((t) => t.category === c))
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim()
  if (!q) return ALL_TOOLS
  return ALL_TOOLS.filter((t) => {
    const searchable = [t.name, t.description, t.category, ...(t.keywords ?? [])]
      .join(' ')
      .toLowerCase()
    return searchable.includes(q)
  })
}
