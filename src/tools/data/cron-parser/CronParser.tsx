'use client'

import { useState, useMemo } from 'react'

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Weekly (Monday)', value: '0 0 * * 1' },
  { label: 'Monthly', value: '0 0 1 * *' },
]

interface FieldInfo {
  label: string
  value: string
  description: string
}

function parseField(value: string, min: number, max: number): number[] {
  const results = new Set<number>()

  for (const part of value.split(',')) {
    const stepParts = part.split('/')
    const step = stepParts[1] ? parseInt(stepParts[1], 10) : 1
    const rangePart = stepParts[0]

    let start: number, end: number

    if (rangePart === '*') {
      start = min
      end = max
    } else if (rangePart.includes('-')) {
      const [a, b] = rangePart.split('-').map(Number)
      start = a
      end = b
    } else {
      start = parseInt(rangePart, 10)
      end = start
    }

    for (let i = start; i <= end; i += step) {
      if (i >= min && i <= max) results.add(i)
    }
  }

  return Array.from(results).sort((a, b) => a - b)
}

function describeField(value: string, fieldName: string, min: number, max: number): string {
  if (value === '*') return `every ${fieldName}`
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${fieldName}s`
  const values = parseField(value, min, max)
  if (values.length === 1) return `${fieldName} ${values[0]}`
  return `${fieldName} ${values.join(', ')}`
}

function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid expression'

  const [minute, hour, dom, month, dow] = parts

  // Common patterns
  if (minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    return 'Every minute'
  }
  if (hour === '*' && dom === '*' && month === '*' && dow === '*') {
    if (minute === '0') return 'Every hour, at the start of the hour'
    if (minute.startsWith('*/')) return `Every ${minute.slice(2)} minutes`
    return `Every hour at minute ${minute}`
  }
  if (dom === '*' && month === '*' && dow === '*') {
    const m = minute === '0' ? '' : `:${minute.padStart(2, '0')}`
    if (hour.startsWith('*/')) return `Every ${hour.slice(2)} hours${m ? ` at minute ${minute}` : ''}`
    const h = parseInt(hour, 10)
    const ampm = h === 0 ? '12:00 AM' : h === 12 ? '12:00 PM' : h > 12 ? `${h - 12}:${minute.padStart(2, '0')} PM` : `${h}:${minute.padStart(2, '0')} AM`
    return `Every day at ${ampm}`
  }
  if (dom === '*' && month === '*' && dow !== '*') {
    const days = parseField(dow, 0, 6).map((d) => DAY_NAMES[d])
    const h = parseInt(hour, 10)
    const ampm = h === 0 ? '12:00 AM' : h === 12 ? '12:00 PM' : h > 12 ? `${h - 12}:${minute.padStart(2, '0')} PM` : `${h}:${minute.padStart(2, '0')} AM`
    return `Every ${days.join(', ')} at ${ampm}`
  }
  if (month === '*' && dow === '*') {
    const h = parseInt(hour, 10)
    const ampm = h === 0 ? '12:00 AM' : h === 12 ? '12:00 PM' : h > 12 ? `${h - 12}:${minute.padStart(2, '0')} PM` : `${h}:${minute.padStart(2, '0')} AM`
    return `On day ${dom} of every month at ${ampm}`
  }

  // Fallback: assemble from parts
  const descriptions: string[] = []
  descriptions.push(describeField(minute, 'minute', 0, 59))
  descriptions.push(describeField(hour, 'hour', 0, 23))
  descriptions.push(describeField(dom, 'day', 1, 31))
  if (month !== '*') descriptions.push(describeField(month, 'month', 1, 12))
  if (dow !== '*') descriptions.push(describeField(dow, 'weekday', 0, 6))
  return descriptions.join(', ')
}

function getNextExecutions(expression: string, count: number): Date[] {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const [minStr, hourStr, domStr, monthStr, dowStr] = parts

  const minutes = parseField(minStr, 0, 59)
  const hours = parseField(hourStr, 0, 23)
  const doms = parseField(domStr, 1, 31)
  const months = parseField(monthStr, 1, 12)
  const dows = parseField(dowStr, 0, 6)

  if (!minutes.length || !hours.length || !doms.length || !months.length || !dows.length) return []

  const results: Date[] = []
  const now = new Date()
  const candidate = new Date(now.getTime())
  candidate.setSeconds(0, 0)
  candidate.setMinutes(candidate.getMinutes() + 1)

  const maxIterations = 525600 // 1 year of minutes
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const m = candidate.getMinutes()
    const h = candidate.getHours()
    const d = candidate.getDate()
    const mo = candidate.getMonth() + 1
    const w = candidate.getDay()

    if (
      minutes.includes(m) &&
      hours.includes(h) &&
      doms.includes(d) &&
      months.includes(mo) &&
      dows.includes(w)
    ) {
      results.push(new Date(candidate))
    }
    candidate.setMinutes(candidate.getMinutes() + 1)
  }

  return results
}

export function CronParser() {
  const [expression, setExpression] = useState('0 0 * * *')

  const { fields, description, nextRuns, error } = useMemo(() => {
    const parts = expression.trim().split(/\s+/)
    if (parts.length !== 5) {
      return {
        fields: null,
        description: null,
        nextRuns: [],
        error: 'Expected 5 fields: minute hour day-of-month month day-of-week',
      }
    }

    const labels = ['Minute (0-59)', 'Hour (0-23)', 'Day of Month (1-31)', 'Month (1-12)', 'Day of Week (0-6)']
    const ranges: [number, number][] = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]]

    const fieldInfos: FieldInfo[] = parts.map((p, i) => ({
      label: labels[i],
      value: p,
      description: describeField(p, labels[i].split(' ')[0].toLowerCase(), ranges[i][0], ranges[i][1]),
    }))

    return {
      fields: fieldInfos,
      description: describeCron(expression),
      nextRuns: getNextExecutions(expression, 5),
      error: null,
    }
  }, [expression])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2">
          Cron Expression
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="* * * * *"
          className="w-full px-3 py-2 text-lg text-stone-700 font-mono border border-stone-200 rounded-lg outline-none focus:border-stone-400 placeholder:text-stone-400 text-center tracking-widest"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setExpression(preset.value)}
            className="px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {description && (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <span className="text-xs text-stone-500 uppercase tracking-wider block mb-2">
            Description
          </span>
          <span className="text-lg font-medium text-stone-800">{description}</span>
        </div>
      )}

      {fields && (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <span className="text-xs text-stone-500 uppercase tracking-wider block mb-3">
            Field Breakdown
          </span>
          <div className="flex flex-col gap-2">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-stone-500">{f.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-medium text-stone-800">{f.value}</span>
                  <span className="text-xs text-stone-400">{f.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {nextRuns.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <span className="text-xs text-stone-500 uppercase tracking-wider block mb-3">
            Next 5 Executions
          </span>
          <div className="flex flex-col gap-2">
            {nextRuns.map((date, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-stone-500">#{i + 1}</span>
                <span className="text-sm font-medium text-stone-700">
                  {date.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
