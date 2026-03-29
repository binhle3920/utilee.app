import { getAllCategorySlugs } from '@/lib/tools'
import { CategoryPageClient } from './CategoryPageClient'

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  return <CategoryPageClient category={category} />
}
