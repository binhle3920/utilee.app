'use client'

import { useRouter } from 'next/navigation'
import { CategoryView } from '@/components/category/CategoryView'
import type { ToolCategory } from '@/tools/types'
import { CATEGORY_ORDER } from '@/tools/types'

interface CategoryPageClientProps {
  category: string
}

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const router = useRouter()

  if (!CATEGORY_ORDER.includes(category as ToolCategory)) {
    router.replace('/')
    return null
  }

  return <CategoryView category={category as ToolCategory} />
}
