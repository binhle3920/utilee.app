'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from './SearchBar'
import { CategorySection } from './CategorySection'
import { ToolCard } from './ToolCard'
import { searchTools, getToolsByCategory } from '@/lib/tools'
import { useFavorites } from '@/lib/useFavorites'
import { useLanguage } from '@/lib/i18n'
import { SettingsMenu } from '@/components/shell/SettingsMenu'
import type { ToolDefinition } from '@/tools/types'

export function DashboardView() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { t } = useLanguage()

  const isSearching = query.trim().length > 0
  const searchResults = isSearching ? searchTools(query) : null
  const byCategory = getToolsByCategory()

  function openTool(slug: string) {
    router.push(`/tools/${slug}`)
  }

  function sortWithFavoritesFirst(tools: ToolDefinition[]) {
    return [...tools].sort((a, b) => {
      const aFav = favorites.includes(a.slug) ? 0 : 1
      const bFav = favorites.includes(b.slug) ? 0 : 1
      return aFav - bFav
    })
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center gap-4 shrink-0">
        <span className="text-base font-semibold tracking-widest uppercase text-stone-800 select-none">Utilee</span>
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <SettingsMenu />
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6">
        {isSearching ? (
          <div>
            <p className="text-xs text-stone-400 mb-4">
              {t.resultsFor(searchResults!.length, query)}
            </p>
            {searchResults!.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                {searchResults!.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    onClick={() => openTool(tool.slug)}
                    isFavorite={isFavorite(tool.slug)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                <span className="text-3xl mb-3">🔍</span>
                <p className="text-sm">{t.noToolsFound}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {Array.from(byCategory.entries()).map(([category, tools]) => (
              <CategorySection
                key={category}
                categoryLabel={t.categories[category]}
                categoryHref={`/category/${category}`}
                tools={sortWithFavoritesFirst(tools)}
                onToolClick={openTool}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
}
