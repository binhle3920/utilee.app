'use client'

import { useState, useCallback, useMemo } from 'react'

interface ParsedUrl {
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
}

export function UrlParser() {
  const [input, setInput] = useState('https://example.com:8080/path/to/page?key=value&foo=bar#section')
  const [copiedField, setCopiedField] = useState('')

  const parsed = useMemo<ParsedUrl | null>(() => {
    if (!input.trim()) return null
    try {
      const url = new URL(input)
      return {
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
      }
    } catch {
      return null
    }
  }, [input])

  const queryParams = useMemo(() => {
    if (!input.trim()) return []
    try {
      const url = new URL(input)
      return Array.from(url.searchParams.entries())
    } catch {
      return []
    }
  }, [input])

  const isInvalid = input.trim().length > 0 && parsed === null

  const handleCopy = useCallback(async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedField(label)
    setTimeout(() => setCopiedField(''), 2000)
  }, [])

  const fields = parsed
    ? [
        { label: 'Protocol', value: parsed.protocol },
        { label: 'Origin', value: parsed.origin },
        { label: 'Host', value: parsed.host },
        { label: 'Hostname', value: parsed.hostname },
        { label: 'Port', value: parsed.port || '(default)' },
        { label: 'Pathname', value: parsed.pathname },
        { label: 'Search', value: parsed.search || '(none)' },
        { label: 'Hash', value: parsed.hash || '(none)' },
      ]
    : []

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Input */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-2">
        <label className="text-xs text-stone-500 uppercase tracking-wider">URL</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?query=value#hash"
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
        />
        {isInvalid && (
          <span className="text-xs text-red-600">Invalid URL. Make sure it includes a protocol (e.g. https://).</span>
        )}
      </div>

      {/* Parsed Parts */}
      {parsed && (
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex flex-col divide-y divide-stone-100">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2.5 gap-4">
                <span className="text-sm text-stone-500 shrink-0">{f.label}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-stone-700 font-mono truncate">
                    {f.value}
                  </span>
                  <button
                    onClick={() => handleCopy(f.label, f.value)}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors shrink-0 px-2 py-0.5 rounded hover:bg-stone-100"
                  >
                    {copiedField === f.label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Parameters */}
      {parsed && queryParams.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-100">
            <span className="text-sm font-medium text-stone-700">
              Query Parameters ({queryParams.length})
            </span>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-x-4 px-5 py-2 border-b border-stone-100 bg-stone-50/50">
            <span className="text-xs text-stone-400 uppercase tracking-wider">Key</span>
            <span className="text-xs text-stone-400 uppercase tracking-wider">Value</span>
            <span className="text-xs text-stone-400 w-12" />
          </div>

          <div className="flex flex-col divide-y divide-stone-50">
            {queryParams.map(([key, value], i) => (
              <div key={`${key}-${i}`} className="grid grid-cols-[1fr_1fr_auto] gap-x-4 px-5 py-2.5 items-center">
                <span className="text-sm font-medium text-stone-700 font-mono truncate">{key}</span>
                <span className="text-sm text-stone-600 font-mono truncate">{value}</span>
                <button
                  onClick={() => handleCopy(`param-${key}-${i}`, `${key}=${value}`)}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-2 py-0.5 rounded hover:bg-stone-100"
                >
                  {copiedField === `param-${key}-${i}` ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!input.trim() && (
        <div className="bg-white border border-stone-200 rounded-xl p-10 flex items-center justify-center">
          <span className="text-sm text-stone-400">Enter a URL above to parse it into its components.</span>
        </div>
      )}
    </div>
  )
}
