'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
}

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function toCamelCase(text: string): string {
  const words = toWords(text)
  if (words.length === 0) return ''
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  )
}

function toPascalCase(text: string): string {
  return toWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function toSnakeCase(text: string): string {
  return toWords(text)
    .map((w) => w.toLowerCase())
    .join('_')
}

function toKebabCase(text: string): string {
  return toWords(text)
    .map((w) => w.toLowerCase())
    .join('-')
}

function toConstantCase(text: string): string {
  return toWords(text)
    .map((w) => w.toUpperCase())
    .join('_')
}

interface Conversion {
  label: string
  fn: (text: string) => string
}

const conversions: Conversion[] = [
  { label: 'UPPERCASE', fn: (t) => t.toUpperCase() },
  { label: 'lowercase', fn: (t) => t.toLowerCase() },
  { label: 'Title Case', fn: toTitleCase },
  { label: 'camelCase', fn: toCamelCase },
  { label: 'snake_case', fn: toSnakeCase },
  { label: 'kebab-case', fn: toKebabCase },
  { label: 'PascalCase', fn: toPascalCase },
  { label: 'CONSTANT_CASE', fn: toConstantCase },
]

export function CaseConverter() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeLabel, setActiveLabel] = useState('')
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(
    (conversion: Conversion) => {
      setOutput(conversion.fn(input))
      setActiveLabel(conversion.label)
      setCopied(false)
    },
    [input]
  )

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.tool.caseConverter.placeholder}
          className="w-full h-48 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-3">
          {t.tool.caseConverter.convertTo}
        </label>
        <div className="flex flex-wrap gap-2">
          {conversions.map((c) => (
            <button
              key={c.label}
              onClick={() => handleConvert(c)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                activeLabel === c.label
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">Output — {activeLabel}</span>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copied ? t.tool.common.copied : t.tool.common.copy}
            </button>
          </div>
          <div className="p-4 max-h-72 overflow-y-auto">
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-mono">
              {output}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
