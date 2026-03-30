'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

type Mode = 'encode' | 'decode'

export function Base64Tool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      if (mode === 'encode') {
        return { output: btoa(unescape(encodeURIComponent(input))), error: '' }
      } else {
        return { output: decodeURIComponent(escape(atob(input.trim()))), error: '' }
      }
    } catch {
      return {
        output: '',
        error: mode === 'decode' ? t.tool.base64.invalidBase64 : t.tool.base64.couldNotEncode,
      }
    }
  }, [input, mode])

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
        <span className="text-sm text-stone-500">{t.tool.common.mode}</span>
        <button
          onClick={() => setMode('encode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {t.tool.common.encode}
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {t.tool.common.decode}
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-100">
          <span className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.common.input}</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? t.tool.base64.encodePlaceholder : t.tool.base64.decodePlaceholder}
          className="w-full h-40 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.common.output}</span>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? t.tool.common.copied : t.tool.common.copy}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={t.tool.common.outputWillAppearHere}
          className="w-full h-40 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400 bg-stone-50"
        />
      </div>
    </div>
  )
}
