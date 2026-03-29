import type { ToolDefinition } from '../../types'
import { QrCodeGenerator } from './QrCodeGenerator'

export const toolDef: ToolDefinition = {
  slug: 'qr-code',
  name: 'QR Code Generator',
  description: 'Generate QR codes from text or URLs, fully offline.',
  category: 'generators',
  icon: '📱',
  component: QrCodeGenerator,
  keywords: ['qr', 'code', 'barcode', 'scan'],
}
