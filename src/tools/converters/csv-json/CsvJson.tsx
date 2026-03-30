'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

type Mode = 'csv-to-json' | 'json-to-csv'

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        fields.push(current)
        current = ''
      } else {
        current += ch
      }
    }
  }
  fields.push(current)
  return fields
}

function csvToJson(csv: string): string {
  const lines = csv.split('\n').filter((l) => l.trim() !== '')
  if (lines.length === 0) return '[]'
  const headers = parseCsvLine(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim() ?? ''
    })
    return obj
  })
  return JSON.stringify(rows, null, 2)
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json)
  if (!Array.isArray(data) || data.length === 0) return ''
  const headers = Object.keys(data[0])

  const escapeCsv = (val: unknown): string => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const headerLine = headers.map(escapeCsv).join(',')
  const rows = data.map((row: Record<string, unknown>) =>
    headers.map((h) => escapeCsv(row[h])).join(',')
  )
  return [headerLine, ...rows].join('\n')
}

export function CsvJson() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('csv-to-json')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      if (mode === 'csv-to-json') {
        return { output: csvToJson(input), error: '' }
      } else {
        return { output: jsonToCsv(input), error: '' }
      }
    } catch (e) {
      return {
        output: '',
        error: e instanceof Error ? e.message : t.tool.csvJson.conversionError,
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
          onClick={() => setMode('csv-to-json')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'csv-to-json'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => setMode('json-to-csv')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'json-to-csv'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          JSON → CSV
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-100">
          <span className="text-xs text-stone-500 uppercase tracking-wider">
            {mode === 'csv-to-json' ? 'CSV' : 'JSON'}
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'csv-to-json' ? t.tool.csvJson.pasteCsv : t.tool.csvJson.pasteJsonArray}
          className="w-full h-48 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 uppercase tracking-wider">
            {mode === 'csv-to-json' ? 'JSON' : 'CSV'}
          </span>
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
          className="w-full h-48 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400 bg-stone-50"
        />
      </div>
    </div>
  )
}
