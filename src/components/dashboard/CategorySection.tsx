'use client'

import { useRouter } from 'next/navigation'
import { ToolCard } from './ToolCard'
import type { ToolDefinition } from '@/tools/types'

interface CategorySectionProps {
  categoryLabel: string
  categoryHref?: string
  tools: ToolDefinition[]
  onToolClick: (slug: string) => void
  favorites?: string[]
  onToggleFavorite?: (slug: string) => void
}

export function CategorySection({ categoryLabel, categoryHref, tools, onToolClick, favorites, onToggleFavorite }: CategorySectionProps) {
  const router = useRouter()

  return (
    <section className="mb-8">
      {categoryHref ? (
        <button
          onClick={() => router.push(categoryHref)}
          className="text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors mb-3 block"
        >
          {categoryLabel}
        </button>
      ) : (
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
          {categoryLabel}
        </h2>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            onClick={() => onToolClick(tool.slug)}
            isFavorite={favorites?.includes(tool.slug) ?? false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
