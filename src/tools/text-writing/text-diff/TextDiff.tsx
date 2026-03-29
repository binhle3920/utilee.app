'use client'

import { useState, useCallback } from 'react'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const a = original.split('\n')
  const b = modified.split('\n')
  const dp = computeLCS(a, b)
  const result: DiffLine[] = []

  let i = a.length
  let j = b.length

  const stack: DiffLine[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: 'unchanged', text: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', text: b[j - 1] })
      j--
    } else {
      stack.push({ type: 'removed', text: a[i - 1] })
      i--
    }
  }

  stack.reverse()
  result.push(...stack)

  return result
}

export function TextDiff() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [diff, setDiff] = useState<DiffLine[] | null>(null)

  const handleCompare = useCallback(() => {
    setDiff(computeDiff(original, modified))
  }, [original, modified])

  const stats = diff
    ? {
        added: diff.filter((d) => d.type === 'added').length,
        removed: diff.filter((d) => d.type === 'removed').length,
        unchanged: diff.filter((d) => d.type === 'unchanged').length,
      }
    : null

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">Original</span>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste the original text here..."
            className="w-full h-56 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400 font-mono"
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">Modified</span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste the modified text here..."
            className="w-full h-56 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400 font-mono"
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Compare
      </button>

      {diff && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">Diff Result</span>
            {stats && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-600">+{stats.added} added</span>
                <span className="text-xs text-red-600">-{stats.removed} removed</span>
                <span className="text-xs text-stone-400">{stats.unchanged} unchanged</span>
              </div>
            )}
          </div>
          <div className="p-0 max-h-96 overflow-y-auto">
            {diff.map((line, idx) => {
              const bgClass =
                line.type === 'added'
                  ? 'bg-green-50 border-l-4 border-green-400'
                  : line.type === 'removed'
                    ? 'bg-red-50 border-l-4 border-red-400'
                    : 'bg-white border-l-4 border-transparent'

              const prefix =
                line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '

              const textColor =
                line.type === 'added'
                  ? 'text-green-800'
                  : line.type === 'removed'
                    ? 'text-red-800'
                    : 'text-stone-600'

              return (
                <div key={idx} className={`${bgClass} px-4 py-0.5 font-mono text-sm`}>
                  <span className={`${textColor} select-none mr-3 opacity-60`}>{prefix}</span>
                  <span className={textColor}>{line.text || '\u00A0'}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
