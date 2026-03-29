import type { ToolDefinition } from '@/tools/types'
import { CATEGORY_LABELS } from '@/tools/types'

interface TopBarProps {
  tool: ToolDefinition
  onDashboard: () => void
  onCategory: () => void
}

export function TopBar({ tool, onDashboard, onCategory }: TopBarProps) {
  return (
    <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-2 shrink-0">
      <button
        onClick={onDashboard}
        className="flex items-center gap-1 px-1.5 py-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        aria-label="Back to dashboard"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs">Dashboard</span>
      </button>
      <span className="text-stone-300 text-xs">/</span>
      <button
        onClick={onCategory}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        {CATEGORY_LABELS[tool.category]}
      </button>
      <span className="text-stone-300 text-xs">/</span>
      <span className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
        <span>{tool.icon}</span>
        {tool.name}
      </span>
    </header>
  )
}
