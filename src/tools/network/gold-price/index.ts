import { GoldPrice } from './GoldPrice'
import type { ToolDefinition } from '../../types'

export const toolDef: ToolDefinition = {
  slug: 'gold-price',
  name: 'Vietnam Gold Price',
  description: 'Live gold prices from SJC, DOJI, and PNJ — Vietnam\'s major gold dealers.',
  category: 'network',
  icon: '🥇',
  component: GoldPrice,
  keywords: ['gold', 'price', 'sjc', 'doji', 'pnj', 'vietnam', 'vang', 'gia'],
}
