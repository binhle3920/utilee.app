'use client'

import { useState } from 'react'

type Base = 2 | 8 | 10 | 16

const BASE_LABELS: Record<Base, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
}

const BASE_PREFIXES: Record<Base, string> = {
  2: '0b',
  8: '0o',
  10: '',
  16: '0x',
}

const BASE_PATTERNS: Record<Base, RegExp> = {
  2: /^[01]*$/,
  8: /^[0-7]*$/,
  10: /^[0-9]*$/,
  16: /^[0-9a-fA-F]*$/,
}

export function NumberBase() {
  const [input, setInput] = useState('')
  const [base, setBase] = useState<Base>(10)
  const [copiedBase, setCopiedBase] = useState<Base | null>(null)

  const isValid = input === '' || BASE_PATTERNS[base].test(input)
  const parsed = isValid && input !== '' ? parseInt(input, base) : NaN

  const results: { base: Base; value: string }[] = [
    { base: 2, value: isNaN(parsed) ? '' : parsed.toString(2) },
    { base: 8, value: isNaN(parsed) ? '' : parsed.toString(8) },
    { base: 10, value: isNaN(parsed) ? '' : parsed.toString(10) },
    { base: 16, value: isNaN(parsed) ? '' : parsed.toString(16).toUpperCase() },
  ]

  const handleCopy = async (b: Base, value: string) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopiedBase(b)
    setTimeout(() => setCopiedBase(null), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">Input base:</span>
          {([2, 8, 10, 16] as Base[]).map((b) => (
            <button
              key={b}
              onClick={() => { setBase(b); setInput('') }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                base === b
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {BASE_LABELS[b]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {BASE_PREFIXES[base] && (
            <span className="text-sm text-stone-400 font-mono">{BASE_PREFIXES[base]}</span>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter a ${BASE_LABELS[base].toLowerCase()} number...`}
            className={`flex-1 px-3 py-2 text-sm font-mono rounded-lg border outline-none transition-colors ${
              !isValid
                ? 'border-red-300 text-red-600 bg-red-50'
                : 'border-stone-200 text-stone-700 bg-white focus:border-stone-400'
            }`}
          />
        </div>

        {!isValid && (
          <p className="text-xs text-red-500">
            Invalid character for {BASE_LABELS[base].toLowerCase()}.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((r) => (
          <div
            key={r.base}
            className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 uppercase tracking-wider">
                {BASE_LABELS[r.base]}
              </span>
              <button
                onClick={() => handleCopy(r.base, r.value)}
                disabled={!r.value}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copiedBase === r.base ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <span className="text-lg font-mono font-semibold text-stone-800 break-all">
              {r.value || '\u2014'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
