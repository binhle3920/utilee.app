'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n'

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const AMBIGUOUS = 'Il1O0o'

function generatePassword(
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useDigits: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean,
): string {
  let chars = ''
  if (useUppercase) chars += CHAR_SETS.uppercase
  if (useLowercase) chars += CHAR_SETS.lowercase
  if (useDigits) chars += CHAR_SETS.digits
  if (useSymbols) chars += CHAR_SETS.symbols

  if (!chars) chars = CHAR_SETS.lowercase

  if (excludeAmbiguous) {
    chars = chars.split('').filter((c) => !AMBIGUOUS.includes(c)).join('')
  }

  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (n) => chars[n % chars.length]).join('')
}

type Strength = 'weak' | 'fair' | 'strong' | 'very strong'

function getStrength(
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useDigits: boolean,
  useSymbols: boolean,
): { label: Strength; color: string; width: string } {
  let poolSize = 0
  if (useUppercase) poolSize += 26
  if (useLowercase) poolSize += 26
  if (useDigits) poolSize += 10
  if (useSymbols) poolSize += 26

  const entropy = length * Math.log2(poolSize || 1)

  if (entropy < 36) return { label: 'weak', color: 'bg-red-500', width: 'w-1/4' }
  if (entropy < 60) return { label: 'fair', color: 'bg-yellow-500', width: 'w-2/4' }
  if (entropy < 80) return { label: 'strong', color: 'bg-green-500', width: 'w-3/4' }
  return { label: 'very strong', color: 'bg-emerald-600', width: 'w-full' }
}

export function PasswordGenerator() {
  const { t } = useLanguage()
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const strength = getStrength(length, useUppercase, useLowercase, useDigits, useSymbols)

  const generate = useCallback(() => {
    setPassword(
      generatePassword(length, useUppercase, useLowercase, useDigits, useSymbols, excludeAmbiguous),
    )
    setCopied(false)
  }, [length, useUppercase, useLowercase, useDigits, useSymbols, excludeAmbiguous])

  useEffect(() => {
    generate()
  }, [generate])

  const handleCopy = useCallback(async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  const strengthLabels: Record<Strength, string> = {
    weak: t.tool.password.weak,
    fair: t.tool.password.fair,
    strong: t.tool.password.strong,
    'very strong': t.tool.password.veryStrong,
  }

  const checkboxOptions = [
    { label: t.tool.password.uppercaseAZ, checked: useUppercase, onChange: setUseUppercase },
    { label: t.tool.password.lowercaseAz, checked: useLowercase, onChange: setUseLowercase },
    { label: t.tool.password.digits09, checked: useDigits, onChange: setUseDigits },
    { label: t.tool.password.symbols, checked: useSymbols, onChange: setUseSymbols },
    { label: t.tool.password.excludeAmbiguous, checked: excludeAmbiguous, onChange: setExcludeAmbiguous },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Password display */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
          <span className="text-xs text-stone-400">{t.tool.password.generatedPassword}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
          >
            {copied ? t.tool.common.copied : t.tool.common.copy}
          </button>
        </div>
        <div className="p-4">
          <p className="text-lg text-stone-800 font-mono break-all select-all leading-relaxed">
            {password}
          </p>
        </div>
        {/* Strength bar */}
        <div className="px-4 pb-4 flex flex-col gap-1.5">
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
          </div>
          <span className="text-xs text-stone-500 capitalize">{strengthLabels[strength.label]}</span>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.common.length} <span className="text-stone-800 font-semibold normal-case tracking-normal">{length}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="flex-1 accent-stone-800"
            />
            <input
              type="number"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Math.min(128, Math.max(8, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-sm border border-stone-200 rounded-md text-center outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {checkboxOptions.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.onChange(e.target.checked)}
                className="w-4 h-4 accent-stone-800"
              />
              <span className="text-sm text-stone-600">{opt.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t.tool.common.regenerate}
        </button>
      </div>
    </div>
  )
}
