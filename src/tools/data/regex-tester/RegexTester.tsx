'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

interface MatchResult {
  match: string
  index: number
  groups: string[]
}

export function RegexTester() {
  const { t } = useLanguage()
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flagG, setFlagG] = useState(true)
  const [flagI, setFlagI] = useState(false)
  const [flagM, setFlagM] = useState(false)
  const [flagS, setFlagS] = useState(false)

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [] as MatchResult[], error: null, highlighted: null }
    }

    const flags = `${flagG ? 'g' : ''}${flagI ? 'i' : ''}${flagM ? 'm' : ''}${flagS ? 's' : ''}`

    try {
      const regex = new RegExp(pattern, flags)
      const results: MatchResult[] = []

      if (flagG) {
        let m: RegExpExecArray | null
        while ((m = regex.exec(testString)) !== null) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
          if (m[0].length === 0) regex.lastIndex++
        }
      } else {
        const m = regex.exec(testString)
        if (m) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
        }
      }

      // Build highlighted string
      const parts: { text: string; isMatch: boolean }[] = []
      let lastIndex = 0
      for (const r of results) {
        if (r.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, r.index), isMatch: false })
        }
        parts.push({ text: r.match, isMatch: true })
        lastIndex = r.index + r.match.length
      }
      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), isMatch: false })
      }

      return { matches: results, error: null, highlighted: parts }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid regex'
      return { matches: [] as MatchResult[], error: msg, highlighted: null }
    }
  }, [pattern, testString, flagG, flagI, flagM, flagS])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-4">
        <div>
          <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2">
            {t.tool.regex.pattern}
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t.tool.regex.patternPlaceholder}
            className="w-full px-3 py-2 text-sm text-stone-700 font-mono border border-stone-200 rounded-lg outline-none focus:border-stone-400 placeholder:text-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2">
            {t.tool.regex.flags}
          </label>
          <div className="flex gap-4">
            {[
              { label: 'g', desc: t.tool.regex.global, value: flagG, set: setFlagG },
              { label: 'i', desc: t.tool.regex.caseInsensitive, value: flagI, set: setFlagI },
              { label: 'm', desc: t.tool.regex.multiline, value: flagM, set: setFlagM },
              { label: 's', desc: t.tool.regex.dotAll, value: flagS, set: setFlagS },
            ].map((f) => (
              <label key={f.label} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.value}
                  onChange={(e) => f.set(e.target.checked)}
                  className="accent-stone-800"
                />
                <span className="text-sm font-mono font-medium text-stone-700">{f.label}</span>
                <span className="text-xs text-stone-400">({f.desc})</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t.tool.regex.testPlaceholder}
          className="w-full h-40 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      {highlighted && highlighted.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-stone-100">
            <span className="text-xs text-stone-500 uppercase tracking-wider">
              {t.tool.regex.matchesHighlighted}
            </span>
          </div>
          <div className="p-4 text-sm text-stone-700 font-mono whitespace-pre-wrap break-all">
            {highlighted.map((part, i) =>
              part.isMatch ? (
                <span key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.regex.matchResults}</span>
            <span className="text-sm font-medium text-stone-700">
              {t.tool.regex.matches(matches.length)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {matches.map((m, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-stone-500">
                    {t.tool.regex.matchAt(i + 1, m.index)}
                  </span>
                </div>
                <div className="text-sm font-mono text-stone-800 break-all">
                  &quot;{m.match}&quot;
                </div>
                {m.groups.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {m.groups.map((g, gi) => (
                      <div key={gi} className="text-xs text-stone-500">
                        {t.tool.regex.group(gi + 1)}{' '}
                        <span className="font-mono text-stone-700">
                          {g !== undefined ? `"${g}"` : 'undefined'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
