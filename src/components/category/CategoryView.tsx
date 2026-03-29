'use client'

import { useRouter } from 'next/navigation'
import { ToolCard } from '@/components/dashboard/ToolCard'
import { getToolsByCategorySlug } from '@/lib/tools'
import { CATEGORY_LABELS, type ToolCategory } from '@/tools/types'
import { useFavorites } from '@/lib/useFavorites'

interface CategoryViewProps {
  category: ToolCategory
}

export function CategoryView({ category }: CategoryViewProps) {
  const router = useRouter()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const tools = getToolsByCategorySlug(category)
  const categoryLabel = CATEGORY_LABELS[category]

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-2 shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 px-1.5 py-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Back to dashboard"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">Dashboard</span>
        </button>
        <span className="text-stone-300 text-xs">/</span>
        <span className="text-sm font-medium text-stone-800">{categoryLabel}</span>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              onClick={() => router.push(`/tools/${tool.slug}`)}
              isFavorite={isFavorite(tool.slug)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
