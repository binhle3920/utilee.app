import type { ToolDefinition } from '@/tools/types'

interface ToolCardProps {
  tool: ToolDefinition
  onClick: () => void
  isFavorite?: boolean
  onToggleFavorite?: (slug: string) => void
}

export function ToolCard({ tool, onClick, isFavorite, onToggleFavorite }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start gap-2 p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150 text-left w-full cursor-default"
    >
      {onToggleFavorite && (
        <span
          role="button"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool.slug) }}
          className={`absolute top-2.5 right-2.5 p-0.5 rounded transition-opacity duration-150 ${
            isFavorite
              ? 'opacity-100 text-rose-500'
              : 'opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-400'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
      )}
      <span className="text-2xl leading-none">{tool.icon}</span>
      <div>
        <p className="font-medium text-stone-800 text-sm leading-snug">{tool.name}</p>
        <p className="text-xs text-stone-400 mt-0.5 leading-snug line-clamp-2">
          {tool.description}
        </p>
      </div>
    </button>
  )
}
