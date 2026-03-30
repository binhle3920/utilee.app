'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

type Mode = 'json-to-yaml' | 'yaml-to-json'

function jsonToYaml(value: unknown, indent: number = 0): string {
  const prefix = '  '.repeat(indent)
  if (value === null) return 'null'
  if (value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') {
    if (
      value === '' ||
      value === 'true' ||
      value === 'false' ||
      value === 'null' ||
      value.includes(':') ||
      value.includes('#') ||
      value.includes('\n') ||
      value.startsWith(' ') ||
      value.endsWith(' ') ||
      value.startsWith('"') ||
      value.startsWith("'") ||
      /^[\d.]+$/.test(value)
    ) {
      return JSON.stringify(value)
    }
    return value
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value
      .map((item) => {
        const serialized = jsonToYaml(item, indent + 1)
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const lines = serialized.split('\n')
          return `${prefix}- ${lines[0].trimStart()}\n${lines.slice(1).join('\n')}`
        }
        return `${prefix}- ${serialized}`
      })
      .join('\n')
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return entries
      .map(([key, val]) => {
        const safeKey = /[:#\s]/.test(key) ? JSON.stringify(key) : key
        if (typeof val === 'object' && val !== null) {
          const child = jsonToYaml(val, indent + 1)
          return `${prefix}${safeKey}:\n${child}`
        }
        return `${prefix}${safeKey}: ${jsonToYaml(val, indent + 1)}`
      })
      .join('\n')
  }
  return String(value)
}

function yamlToJson(yaml: string): unknown {
  const lines = yaml.split('\n')
  const result = parseYamlLines(lines, 0, 0)
  return result.value
}

interface ParseResult {
  value: unknown
  nextIndex: number
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/)
  return match ? match[1].length : 0
}

function parseYamlValue(raw: string): unknown {
  const trimmed = raw.trim()
  if (trimmed === '' || trimmed === 'null' || trimmed === '~') return null
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10)
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  if (trimmed === '[]') return []
  if (trimmed === '{}') return ({})
  return trimmed
}

function parseYamlLines(lines: string[], startIndex: number, baseIndent: number): ParseResult {
  if (startIndex >= lines.length) return { value: null, nextIndex: startIndex }

  // Skip empty lines and comments
  let i = startIndex
  while (i < lines.length && (lines[i].trim() === '' || lines[i].trim().startsWith('#'))) {
    i++
  }
  if (i >= lines.length) return { value: null, nextIndex: i }

  const firstLine = lines[i]
  const firstTrimmed = firstLine.trimStart()

  // Detect if this block is an array (starts with -)
  if (firstTrimmed.startsWith('- ') || firstTrimmed === '-') {
    const arr: unknown[] = []
    while (i < lines.length) {
      // Skip empty lines
      while (i < lines.length && lines[i].trim() === '') i++
      if (i >= lines.length) break
      const line = lines[i]
      const indent = getIndent(line)
      if (indent < baseIndent) break
      const trimmed = line.trimStart()
      if (!trimmed.startsWith('- ') && trimmed !== '-') break

      const afterDash = trimmed === '-' ? '' : trimmed.slice(2)

      if (afterDash.includes(': ') || afterDash.endsWith(':')) {
        // It's an inline object start within array item
        const childIndent = indent + 2
        // Reconstruct: the part after "- " as first line of an object, plus subsequent indented lines
        const subLines: string[] = ['  '.repeat(childIndent) + afterDash]
        let j = i + 1
        while (j < lines.length) {
          if (lines[j].trim() === '') { subLines.push(lines[j]); j++; continue }
          if (getIndent(lines[j]) >= childIndent) { subLines.push(lines[j]); j++ }
          else break
        }
        const sub = parseYamlLines(subLines, 0, childIndent)
        arr.push(sub.value)
        i = j
      } else {
        arr.push(parseYamlValue(afterDash))
        i++
      }
    }
    return { value: arr, nextIndex: i }
  }

  // Otherwise it's a mapping
  const obj: Record<string, unknown> = {}
  while (i < lines.length) {
    while (i < lines.length && lines[i].trim() === '') i++
    if (i >= lines.length) break
    const line = lines[i]
    const indent = getIndent(line)
    if (indent < baseIndent) break
    if (indent > baseIndent) break // shouldn't happen for well-formed yaml
    const trimmed = line.trimStart()
    if (trimmed.startsWith('#')) { i++; continue }

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    let key = trimmed.slice(0, colonIdx)
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1)
    }
    const afterColon = trimmed.slice(colonIdx + 1).trim()

    if (afterColon === '' || afterColon === '') {
      // Value is a nested block
      let childIndent = baseIndent + 2
      // Find actual child indent
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      if (j < lines.length) {
        childIndent = getIndent(lines[j])
      }
      if (j < lines.length && childIndent > baseIndent) {
        const sub = parseYamlLines(lines, j, childIndent)
        obj[key] = sub.value
        i = sub.nextIndex
      } else {
        obj[key] = null
        i++
      }
    } else {
      obj[key] = parseYamlValue(afterColon)
      i++
    }
  }
  return { value: obj, nextIndex: i }
}

export function JsonYaml() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('json-to-yaml')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        return { output: jsonToYaml(parsed), error: '' }
      } else {
        const parsed = yamlToJson(input)
        return { output: JSON.stringify(parsed, null, 2), error: '' }
      }
    } catch (e) {
      return {
        output: '',
        error: e instanceof Error ? e.message : t.tool.jsonYaml.conversionError,
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
          onClick={() => setMode('json-to-yaml')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'json-to-yaml'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          JSON → YAML
        </button>
        <button
          onClick={() => setMode('yaml-to-json')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'yaml-to-json'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          YAML → JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-stone-100">
            <span className="text-xs text-stone-500 uppercase tracking-wider">
              {mode === 'json-to-yaml' ? 'JSON' : 'YAML'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'json-to-yaml' ? t.tool.jsonYaml.pasteJson : t.tool.jsonYaml.pasteYaml}
            className="w-full h-64 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400"
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider">
              {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
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
            className="w-full h-64 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400 bg-stone-50"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
