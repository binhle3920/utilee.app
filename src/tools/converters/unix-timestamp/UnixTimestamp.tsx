'use client'

import { useState, useEffect, useCallback } from 'react'

function formatRelative(date: Date): string {
  const now = Date.now()
  const diffMs = now - date.getTime()
  const absDiff = Math.abs(diffMs)
  const isFuture = diffMs < 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let relative: string
  if (seconds < 60) relative = `${seconds} second${seconds !== 1 ? 's' : ''}`
  else if (minutes < 60) relative = `${minutes} minute${minutes !== 1 ? 's' : ''}`
  else if (hours < 24) relative = `${hours} hour${hours !== 1 ? 's' : ''}`
  else if (days < 30) relative = `${days} day${days !== 1 ? 's' : ''}`
  else if (months < 12) relative = `${months} month${months !== 1 ? 's' : ''}`
  else relative = `${years} year${years !== 1 ? 's' : ''}`

  return isFuture ? `${relative} from now` : `${relative} ago`
}

function toLocalDatetimeString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}:${s}`
}

export function UnixTimestamp() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
  const [timestampInput, setTimestampInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [useMs, setUseMs] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const parsedFromTimestamp = (() => {
    if (!timestampInput.trim()) return null
    const num = Number(timestampInput)
    if (isNaN(num)) return null
    const ms = useMs ? num : num * 1000
    const date = new Date(ms)
    if (isNaN(date.getTime())) return null
    return date
  })()

  const parsedFromDate = (() => {
    if (!dateInput) return null
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) return null
    return date
  })()

  const handleCopy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Current timestamp */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-2">
        <span className="text-xs text-stone-500 uppercase tracking-wider">Current Unix Timestamp</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-mono font-semibold text-stone-800">{now}</span>
          <button
            onClick={() => handleCopy(String(now), 'now')}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {copied === 'now' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
        <span className="text-sm text-stone-500">Unit:</span>
        <button
          onClick={() => setUseMs(false)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            !useMs ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Seconds
        </button>
        <button
          onClick={() => setUseMs(true)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            useMs ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Milliseconds
        </button>
      </div>

      {/* Timestamp to date */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <span className="text-xs text-stone-500 uppercase tracking-wider">Timestamp → Date</span>
        <input
          type="text"
          value={timestampInput}
          onChange={(e) => setTimestampInput(e.target.value)}
          placeholder={useMs ? 'Enter timestamp in milliseconds...' : 'Enter timestamp in seconds...'}
          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors"
        />
        {timestampInput.trim() && !parsedFromTimestamp && (
          <p className="text-xs text-red-500">Invalid timestamp.</p>
        )}
        {parsedFromTimestamp && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-stone-500">UTC</span>
              <span className="text-sm font-medium text-stone-700 font-mono">
                {parsedFromTimestamp.toUTCString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-stone-500">Local</span>
              <span className="text-sm font-medium text-stone-700 font-mono">
                {parsedFromTimestamp.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-stone-500">Relative</span>
              <span className="text-sm font-medium text-stone-700">
                {formatRelative(parsedFromTimestamp)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Date to timestamp */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <span className="text-xs text-stone-500 uppercase tracking-wider">Date → Timestamp</span>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDateInput(toLocalDatetimeString(new Date()))}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Use current time
          </button>
        </div>
        {parsedFromDate && (
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-stone-500">
              {useMs ? 'Milliseconds' : 'Seconds'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700 font-mono">
                {useMs ? parsedFromDate.getTime() : Math.floor(parsedFromDate.getTime() / 1000)}
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    String(useMs ? parsedFromDate.getTime() : Math.floor(parsedFromDate.getTime() / 1000)),
                    'date-ts'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
              >
                {copied === 'date-ts' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
