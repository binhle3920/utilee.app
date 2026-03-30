'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

interface Stats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  readingTime: string
  speakingTime: string
}

function computeStats(text: string): Stats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: '0 sec',
      speakingTime: '0 sec',
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
  const lines = text.split('\n').length

  const readingMinutes = words / 238
  const speakingMinutes = words / 150

  const formatTime = (minutes: number) => {
    if (minutes < 1) return `${Math.ceil(minutes * 60)} sec`
    const m = Math.floor(minutes)
    const s = Math.round((minutes - m) * 60)
    return s > 0 ? `${m} min ${s} sec` : `${m} min`
  }

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime: formatTime(readingMinutes),
    speakingTime: formatTime(speakingMinutes),
  }
}

export function WordCounter() {
  const { t } = useLanguage()
  const [text, setText] = useState('')

  const stats = useMemo(() => computeStats(text), [text])

  const primaryStats = [
    { label: t.tool.wordCounter.words, value: stats.words },
    { label: t.tool.wordCounter.characters, value: stats.characters },
    { label: t.tool.wordCounter.sentences, value: stats.sentences },
    { label: t.tool.wordCounter.paragraphs, value: stats.paragraphs },
  ]

  const secondaryStats = [
    { label: t.tool.wordCounter.charactersNoSpaces, value: stats.charactersNoSpaces },
    { label: t.tool.wordCounter.lines, value: stats.lines },
    { label: t.tool.wordCounter.readingTime, value: stats.readingTime },
    { label: t.tool.wordCounter.speakingTime, value: stats.speakingTime },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-3">
        {primaryStats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-1"
          >
            <span className="text-2xl font-semibold text-stone-800">{s.value}</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.tool.wordCounter.placeholder}
          className="w-full h-64 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-3">
          {secondaryStats.map((s) => (
            <div key={s.label} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-stone-500">{s.label}</span>
              <span className="text-sm font-medium text-stone-700">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
