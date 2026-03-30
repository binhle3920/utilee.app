'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

type Mode = 'encode' | 'decode'
type Method = 'component' | 'uri'

export function UrlEncoder() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [method, setMethod] = useState<Method>('component')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const getOutput = useCallback(() => {
    if (!input) return ''
    setError('')
    try {
      if (mode === 'encode') {
        return method === 'component'
          ? encodeURIComponent(input)
          : encodeURI(input)
      } else {
        return method === 'component'
          ? decodeURIComponent(input)
          : decodeURI(input)
      }
    } catch {
      setError(
        mode === 'decode'
          ? t.tool.urlEncoder.invalidEncoded
          : t.tool.urlEncoder.couldNotEncode
      )
      return ''
    }
  }, [input, mode, method, t])

  const output = getOutput()

  const encodedCharCount = (() => {
    if (!output || mode !== 'encode') return null
    const encoded = output.length - input.length + (output.match(/%[0-9A-Fa-f]{2}/g) || []).length
    const totalEncoded = (output.match(/%[0-9A-Fa-f]{2}/g) || []).length
    const percentage = input.length > 0 ? ((totalEncoded * 3) / output.length * 100).toFixed(1) : '0'
    return { totalEncoded, percentage }
  })()

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Mode & Method Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500 w-16">{t.tool.common.mode.replace(':', '')}</span>
          <div className="flex rounded-lg border border-stone-200 overflow-hidden">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {t.tool.common.encode}
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {t.tool.common.decode}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500 w-16">{t.tool.common.method}</span>
          <div className="flex rounded-lg border border-stone-200 overflow-hidden">
            <button
              onClick={() => setMethod('component')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                method === 'component'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              encodeURIComponent
            </button>
            <button
              onClick={() => setMethod('uri')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                method === 'uri'
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              encodeURI
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-400">
          {method === 'component'
            ? t.tool.urlEncoder.componentDesc
            : t.tool.urlEncoder.uriDesc}
        </p>
      </div>

      {/* Input */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
        <label className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.common.input}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? t.tool.urlEncoder.encodePlaceholder
              : t.tool.urlEncoder.decodePlaceholder
          }
          rows={5}
          className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
        />
        <div className="flex justify-end">
          <span className="text-xs text-stone-400">{input.length} {t.tool.common.characters}</span>
        </div>
      </div>

      {/* Output */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.common.output}</label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-3 py-1 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? t.tool.common.copied : t.tool.common.copy}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          rows={5}
          className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 font-mono placeholder:text-stone-400 focus:outline-none"
        />
        {error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">{output.length} {t.tool.common.characters}</span>
          {encodedCharCount && (
            <span className="text-xs text-stone-400">
              {t.tool.urlEncoder.encodedChars(encodedCharCount.totalEncoded, encodedCharCount.percentage)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
