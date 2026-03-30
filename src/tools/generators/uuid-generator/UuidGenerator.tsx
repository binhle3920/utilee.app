'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback v4 UUID implementation
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant 1
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-')
}

export function UuidGenerator() {
  const { t } = useLanguage()
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const handleGenerate = useCallback(() => {
    const result = Array.from({ length: count }, () => {
      const uuid = generateUuidV4()
      return uppercase ? uuid.toUpperCase() : uuid
    })
    setUuids(result)
    setCopiedIndex(null)
    setCopiedAll(false)
  }, [count, uppercase])

  const handleCopySingle = useCallback(async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (!uuids.length) return
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }, [uuids])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.common.count} <span className="text-stone-800 font-semibold normal-case tracking-normal">{count}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-stone-800"
            />
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-sm border border-stone-200 rounded-md text-center outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 accent-stone-800"
          />
          <span className="text-sm text-stone-600">{t.tool.uuid.uppercase}</span>
        </label>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t.tool.common.generate}
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">
              {t.tool.uuid.generated(uuids.length)}
            </span>
            <button
              onClick={handleCopyAll}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copiedAll ? t.tool.common.copied : t.tool.common.copyAll}
            </button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto flex flex-col gap-2">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 group"
              >
                <span className="text-sm text-stone-700 font-mono select-all break-all">
                  {uuid}
                </span>
                <button
                  onClick={() => handleCopySingle(uuid, i)}
                  className="shrink-0 text-xs text-stone-400 hover:text-stone-700 transition-colors px-2 py-1 rounded hover:bg-stone-100 opacity-0 group-hover:opacity-100"
                >
                  {copiedIndex === i ? t.tool.common.copied : t.tool.common.copy}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
