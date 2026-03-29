'use client'

import { useRouter } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools'
import { TopBar } from '@/components/shell/TopBar'

interface ToolPageClientProps {
  slug: string
}

export function ToolPageClient({ slug }: ToolPageClientProps) {
  const router = useRouter()
  const tool = getToolBySlug(slug)

  if (!tool) {
    router.replace('/')
    return null
  }

  const ToolComponent = tool.component

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <TopBar
        tool={tool}
        onDashboard={() => router.push('/')}
        onCategory={() => router.push(`/category/${tool.category}`)}
      />
      <main className="flex-1 overflow-y-auto p-6">
        <ToolComponent />
      </main>
    </div>
  )
}
