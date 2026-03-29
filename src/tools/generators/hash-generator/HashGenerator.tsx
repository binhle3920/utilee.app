'use client'

import { useState, useEffect, useCallback } from 'react'

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGORITHMS: Algorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

async function computeHash(algorithm: Algorithm, text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  })
  const [copiedAlgo, setCopiedAlgo] = useState<Algorithm | null>(null)

  useEffect(() => {
    if (!input) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' })
      return
    }

    let cancelled = false
    async function run() {
      const results: Record<string, string> = {}
      for (const algo of ALGORITHMS) {
        results[algo] = await computeHash(algo, input)
      }
      if (!cancelled) {
        setHashes(results as Record<Algorithm, string>)
      }
    }
    run()
    return () => { cancelled = true }
  }, [input])

  const handleCopy = useCallback(async (algo: Algorithm) => {
    const hash = hashes[algo]
    if (!hash) return
    await navigator.clipboard.writeText(hash)
    setCopiedAlgo(algo)
    setTimeout(() => setCopiedAlgo(null), 2000)
  }, [hashes])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash..."
          className="w-full h-40 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      {input && (
        <div className="flex flex-col gap-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  {algo}
                </span>
                <button
                  onClick={() => handleCopy(algo)}
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
                >
                  {copiedAlgo === algo ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-stone-700 font-mono break-all select-all leading-relaxed">
                  {hashes[algo] || 'Computing...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!input && (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
          <p className="text-sm text-stone-400">
            Enter text above to generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes in real-time.
          </p>
          <p className="text-xs text-stone-400 mt-2">
            MD5 is not available via the Web Crypto API.
          </p>
        </div>
      )}
    </div>
  )
}
