'use client'

import { useState, useMemo, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

type Separator = '-' | '_'

function generateSlug(
  text: string,
  separator: Separator,
  lowercase: boolean,
  maxLength: number
): string {
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/[\s-_]+/g, separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '')

  if (lowercase) {
    slug = slug.toLowerCase()
  }

  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength)
    // Don't end with a separator
    slug = slug.replace(new RegExp(`\\${separator}$`), '')
  }

  return slug
}

export function SlugGenerator() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState<Separator>('-')
  const [lowercase, setLowercase] = useState(true)
  const [maxLength, setMaxLength] = useState(0)
  const [copied, setCopied] = useState(false)

  const slug = useMemo(
    () => generateSlug(input, separator, lowercase, maxLength),
    [input, separator, lowercase, maxLength]
  )

  const handleCopy = useCallback(async () => {
    if (!slug) return
    await navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [slug])

  const separatorOptions: { value: Separator; label: string }[] = [
    { value: '-', label: t.tool.slugGenerator.hyphen },
    { value: '_', label: t.tool.slugGenerator.underscore },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-stone-100">
          <span className="text-xs text-stone-400">{t.tool.slugGenerator.inputText}</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.tool.slugGenerator.placeholder}
          className="w-full px-4 py-3 text-sm text-stone-700 outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.slugGenerator.separator}
          </label>
          <div className="flex gap-2">
            {separatorOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSeparator(opt.value)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  separator === opt.value
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="w-4 h-4 accent-stone-800"
          />
          <span className="text-sm text-stone-600">{t.tool.slugGenerator.forceLowercase}</span>
        </label>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.slugGenerator.maxLength}{' '}
            <span className="text-stone-800 font-semibold normal-case tracking-normal">
              {maxLength === 0 ? t.tool.slugGenerator.unlimited : maxLength}
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={200}
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="flex-1 accent-stone-800"
            />
            <input
              type="number"
              min={0}
              max={200}
              value={maxLength}
              onChange={(e) => setMaxLength(Math.min(200, Math.max(0, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-sm border border-stone-200 rounded-md text-center outline-none focus:border-stone-400"
            />
          </div>
        </div>
      </div>

      {slug && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">
              {t.tool.slugGenerator.generatedSlug} — {slug.length} {slug.length !== 1 ? t.tool.slugGenerator.characters : t.tool.slugGenerator.character}
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copied ? t.tool.common.copied : t.tool.common.copy}
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-stone-700 leading-relaxed font-mono break-all">
              {slug}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
