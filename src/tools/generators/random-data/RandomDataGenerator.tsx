'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
]

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
]

const DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com',
  'icloud.com', 'mail.com', 'fastmail.com', 'zoho.com', 'aol.com',
]

const STREET_NAMES = [
  'Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lake',
  'Hill', 'Park', 'Forest', 'River', 'Sunset', 'Highland', 'Meadow',
  'Spring', 'Valley', 'Church', 'Liberty', 'Market', 'Walnut', 'Birch',
]

const STREET_SUFFIXES = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Ct', 'Pl']

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Jacksonville', 'Fort Worth',
  'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco', 'Seattle', 'Denver',
  'Nashville', 'Portland', 'Oklahoma City', 'Las Vegas', 'Memphis', 'Louisville',
  'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
]

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
  'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
  'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY',
]

type DataType = 'names' | 'emails' | 'phones' | 'addresses' | 'dates' | 'numbers'


function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateItem(type: DataType): string {
  switch (type) {
    case 'names':
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`

    case 'emails': {
      const first = pick(FIRST_NAMES).toLowerCase()
      const last = pick(LAST_NAMES).toLowerCase()
      const sep = pick(['.', '_', ''])
      const num = Math.random() > 0.5 ? String(randInt(1, 999)) : ''
      return `${first}${sep}${last}${num}@${pick(DOMAINS)}`
    }

    case 'phones': {
      const area = randInt(200, 999)
      const prefix = randInt(200, 999)
      const line = randInt(1000, 9999)
      return `(${area}) ${prefix}-${line}`
    }

    case 'addresses': {
      const num = randInt(1, 9999)
      const street = pick(STREET_NAMES)
      const suffix = pick(STREET_SUFFIXES)
      const city = pick(CITIES)
      const state = pick(STATES)
      const zip = String(randInt(10000, 99999))
      return `${num} ${street} ${suffix}, ${city}, ${state} ${zip}`
    }

    case 'dates': {
      const year = randInt(1970, 2030)
      const month = randInt(1, 12)
      const day = randInt(1, 28)
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    case 'numbers':
      return String(randInt(0, 1000000))
  }
}

export function RandomDataGenerator() {
  const { t } = useLanguage()

  const DATA_TYPES: { value: DataType; label: string }[] = [
    { value: 'names', label: t.tool.randomData.names },
    { value: 'emails', label: t.tool.randomData.emails },
    { value: 'phones', label: t.tool.randomData.phoneNumbers },
    { value: 'addresses', label: t.tool.randomData.addresses },
    { value: 'dates', label: t.tool.randomData.dates },
    { value: 'numbers', label: t.tool.randomData.numbers },
  ]

  const [dataType, setDataType] = useState<DataType>('names')
  const [count, setCount] = useState(10)
  const [results, setResults] = useState<string[]>([])
  const [copiedAll, setCopiedAll] = useState(false)

  const handleGenerate = useCallback(() => {
    const items = Array.from({ length: count }, () => generateItem(dataType))
    setResults(items)
    setCopiedAll(false)
  }, [dataType, count])

  const handleCopyAll = useCallback(async () => {
    if (!results.length) return
    await navigator.clipboard.writeText(results.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }, [results])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.randomData.dataType}
          </label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg outline-none focus:border-stone-400 text-stone-700 bg-white"
          >
            {DATA_TYPES.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {t.tool.common.count} <span className="text-stone-800 font-semibold normal-case tracking-normal">{count}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-stone-800"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-sm border border-stone-200 rounded-md text-center outline-none focus:border-stone-400"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t.tool.common.generate}
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">
              {t.tool.randomData.results(results.length)}
            </span>
            <button
              onClick={handleCopyAll}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copiedAll ? t.tool.common.copied : t.tool.common.copyAll}
            </button>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              {results.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-6 text-right shrink-0">{i + 1}.</span>
                  <span className="text-sm text-stone-700 font-mono select-all">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
