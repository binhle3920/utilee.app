import { getAllSlugs } from '@/lib/tools'
import { ToolPageClient } from './ToolPageClient'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ToolPageClient slug={slug} />
}
