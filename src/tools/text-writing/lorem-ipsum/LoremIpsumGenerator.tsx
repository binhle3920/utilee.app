'use client'

import { useState, useCallback } from 'react'

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
]

type OutputType = 'paragraphs' | 'sentences' | 'words'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateWord(): string {
  return WORDS[randomInt(0, WORDS.length - 1)]
}

function generateSentence(): string {
  const wordCount = randomInt(8, 20)
  const words = Array.from({ length: wordCount }, generateWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateParagraph(): string {
  const sentenceCount = randomInt(3, 6)
  return Array.from({ length: sentenceCount }, generateSentence).join(' ')
}

function generate(type: OutputType, count: number, startWithLorem: boolean): string {
  if (type === 'words') {
    const words = Array.from({ length: count }, generateWord)
    if (startWithLorem && words.length >= 2) {
      words[0] = 'Lorem'
      words[1] = 'ipsum'
    }
    return words.join(' ')
  }

  if (type === 'sentences') {
    const sentences = Array.from({ length: count }, generateSentence)
    if (startWithLorem) {
      sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
    return sentences.join(' ')
  }

  const paragraphs = Array.from({ length: count }, generateParagraph)
  if (startWithLorem) {
    paragraphs[0] =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }
  return paragraphs.join('\n\n')
}

export function LoremIpsumGenerator() {
  const [outputType, setOutputType] = useState<OutputType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const maxCount = outputType === 'words' ? 200 : outputType === 'sentences' ? 20 : 10

  const handleGenerate = useCallback(() => {
    setOutput(generate(outputType, count, startWithLorem))
    setCopied(false)
  }, [outputType, count, startWithLorem])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const typeOptions: { value: OutputType; label: string }[] = [
    { value: 'paragraphs', label: 'Paragraphs' },
    { value: 'sentences', label: 'Sentences' },
    { value: 'words', label: 'Words' },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Output Type
          </label>
          <div className="flex gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setOutputType(opt.value)
                  setCount(opt.value === 'words' ? 50 : opt.value === 'sentences' ? 5 : 3)
                }}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  outputType === opt.value
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Count: <span className="text-stone-800 font-semibold normal-case tracking-normal">{count}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={maxCount}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-stone-800"
            />
            <input
              type="number"
              min={1}
              max={maxCount}
              value={count}
              onChange={(e) => setCount(Math.min(maxCount, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-sm border border-stone-200 rounded-md text-center outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="w-4 h-4 accent-stone-800"
          />
          <span className="text-sm text-stone-600">Start with &ldquo;Lorem ipsum&hellip;&rdquo;</span>
        </label>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Generate
        </button>
      </div>

      {output && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">Output</span>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 max-h-72 overflow-y-auto">
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap font-mono">
              {output}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
