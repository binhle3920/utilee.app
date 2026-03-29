import type { ComponentType } from 'react'

export type ToolCategory =
  | 'text-writing'
  | 'converters'
  | 'generators'
  | 'images'
  | 'data'
  | 'network'

export interface ToolDefinition {
  slug: string
  name: string
  description: string
  category: ToolCategory
  icon: string
  component: ComponentType
  keywords?: string[]
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  'text-writing': 'Text & Writing',
  'converters': 'Converters',
  'generators': 'Generators',
  'images': 'Images',
  'data': 'Data',
  'network': 'Network',
}

export const CATEGORY_ORDER: ToolCategory[] = [
  'text-writing',
  'converters',
  'generators',
  'images',
  'data',
  'network',
]
