'use client'

import { useState, useMemo } from 'react'

interface JsonStats {
  keys: number
  depth: number
  size: string
}

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0
  if (Array.isArray(obj)) {
    return obj.reduce((sum: number, item) => sum + countKeys(item), 0)
  }
  let count = Object.keys(obj).length
  for (const val of Object.values(obj)) {
    count += countKeys(val)
  }
  return count
}

function measureDepth(obj: unknown, current: number = 0): number {
  if (obj === null || typeof obj !== 'object') return current
  if (Array.isArray(obj)) {
    if (obj.length === 0) return current + 1
    return Math.max(...obj.map((item) => measureDepth(item, current + 1)))
  }
  const values = Object.values(obj)
  if (values.length === 0) return current + 1
  return Math.max(...values.map((val) => measureDepth(val, current + 1)))
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<{ valid: boolean; message: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const stats = useMemo<JsonStats | null>(() => {
    if (!input.trim()) return null
    try {
      const parsed = JSON.parse(input)
      return {
        keys: countKeys(parsed),
        depth: measureDepth(parsed),
        size: formatBytes(new TextEncoder().encode(input).byteLength),
      }
    } catch {
      return null
    }
  }, [input])

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setStatus({ valid: true, message: 'Valid JSON' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON'
      setOutput('')
      setStatus({ valid: false, message: msg })
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setStatus({ valid: true, message: 'Valid JSON (minified)' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON'
      setOutput('')
      setStatus({ valid: false, message: msg })
    }
  }

  const handleValidate = () => {
    try {
      JSON.parse(input)
      setStatus({ valid: true, message: 'Valid JSON' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON'
      setStatus({ valid: false, message: msg })
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here...'
          className="w-full h-48 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          Validate
        </button>
      </div>

      {status && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            status.valid
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold text-stone-800">{stats.keys}</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider">Keys</span>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold text-stone-800">{stats.depth}</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider">Depth</span>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold text-stone-800">{stats.size}</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider">Size</span>
          </div>
        </div>
      )}

      {output && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
            <span className="text-xs text-stone-500 uppercase tracking-wider">Output</span>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 text-sm text-stone-700 font-mono whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
