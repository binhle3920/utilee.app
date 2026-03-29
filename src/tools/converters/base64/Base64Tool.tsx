'use client'

import { useState, useMemo } from 'react'

type Mode = 'encode' | 'decode'

export function Base64Tool() {
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
        error: mode === 'decode' ? 'Invalid Base64 input.' : 'Could not encode input.',
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
        <span className="text-sm text-stone-500">Mode:</span>
        <button
          onClick={() => setMode('encode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-100">
          <span className="text-xs text-stone-500 uppercase tracking-wider">Input</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
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
          <span className="text-xs text-stone-500 uppercase tracking-wider">Output</span>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          placeholder="Output will appear here..."
          className="w-full h-40 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400 bg-stone-50"
        />
      </div>
    </div>
  )
}
