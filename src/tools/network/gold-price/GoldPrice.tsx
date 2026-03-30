'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const API_URL = 'https://www.vang.today/api/prices'
const HISTORY_URL = 'https://www.vang.today/api/prices'

interface GoldItem {
  name: string
  buy: number
  sell: number
  change_buy: number
  change_sell: number
  currency: string
}

interface ApiResponse {
  success: boolean
  timestamp: number
  time: string
  date: string
  prices: Record<string, GoldItem>
}

interface HistoryDay {
  date: string
  prices: Record<string, {
    name: string
    buy: number
    sell: number
    day_change_buy: number
    day_change_sell: number
    updates: number
  }>
}

interface HistoryResponse {
  success: boolean
  history: HistoryDay[]
}

// --- Grouping ---

interface Group {
  label: string
  codes: string[]
}

const GROUPS: Group[] = [
  { label: 'SJC', codes: ['SJL1L10', 'SJ9999', 'VNGSJC', 'VIETTINMSJC'] },
  { label: 'Bao Tin', codes: ['BT9999NTT', 'BTSJC'] },
  { label: 'DOJI', codes: ['DOJINHTV', 'DOHNL', 'DOHCML'] },
  { label: 'PNJ', codes: ['PQHN24NTT', 'PQHNVM'] },
]

// --- Formatting helpers ---

function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatPrice(value: number, currency: string): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }
  return formatVnd(value)
}

function formatChange(value: number): { text: string; className: string } {
  if (value === 0) return { text: '—', className: 'text-stone-400' }
  const formatted = formatVnd(Math.abs(value))
  if (value > 0) return { text: `+${formatted}`, className: 'text-emerald-600' }
  return { text: `-${formatted}`, className: 'text-red-600' }
}

function formatAxisLabel(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

function formatDateShort(dateStr: string): string {
  const parts = dateStr.split('-')
  return `${parts[2]}/${parts[1]}`
}

// --- SVG Line Chart ---

interface ChartPoint {
  date: string
  buy: number
  sell: number
}

interface Tooltip {
  x: number
  y: number
  label: string
  value: string
  color: string
  date: string
}

function PriceChart({ data, height = 260 }: { data: ChartPoint[]; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  if (data.length < 2) return null

  const pad = { top: 20, right: 16, bottom: 40, left: 56 }
  const w = 600
  const h = height
  const cw = w - pad.left - pad.right
  const ch = h - pad.top - pad.bottom

  const allVals = data.flatMap((d) => [d.buy, d.sell]).filter((v) => v > 0)
  const minVal = Math.min(...allVals)
  const maxVal = Math.max(...allVals)
  const range = maxVal - minVal || 1
  const yMin = minVal - range * 0.05
  const yMax = maxVal + range * 0.05
  const yRange = yMax - yMin

  const xPos = (i: number) => pad.left + (i / (data.length - 1)) * cw
  const yPos = (v: number) => pad.top + ch - ((v - yMin) / yRange) * ch

  const buildLine = (key: 'buy' | 'sell') =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d[key]).toFixed(1)}`)
      .join(' ')

  const yTicks = Array.from({ length: 5 }, (_, i) => yMin + (yRange / 4) * i)

  const labelCount = Math.min(6, data.length)
  const xLabelIndices = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (data.length - 1))
  )

  const handleDotHover = (
    e: React.MouseEvent<SVGCircleElement>,
    point: ChartPoint,
    type: 'buy' | 'sell'
  ) => {
    const container = containerRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const circle = e.currentTarget
    const cx = parseFloat(circle.getAttribute('cx') || '0')
    const cy = parseFloat(circle.getAttribute('cy') || '0')
    // Convert SVG coords to pixel coords
    const px = (cx / w) * rect.width
    const py = (cy / h) * rect.height
    setTooltip({
      x: px,
      y: py,
      label: type === 'buy' ? 'Buy' : 'Sell',
      value: formatVnd(point[type]),
      color: type === 'buy' ? '#dc2626' : '#16a34a',
      date: formatDateShort(point.date),
    })
  }

  return (
    <div ref={containerRef} className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.left}
              x2={w - pad.right}
              y1={yPos(v)}
              y2={yPos(v)}
              stroke="#e7e5e4"
              strokeWidth={0.5}
            />
            <text
              x={pad.left - 8}
              y={yPos(v) + 4}
              textAnchor="end"
              className="fill-stone-400"
              fontSize={10}
            >
              {formatAxisLabel(Math.round(v))}
            </text>
          </g>
        ))}

        {/* X labels */}
        {xLabelIndices.map((i) => (
          <text
            key={i}
            x={xPos(i)}
            y={h - pad.bottom + 20}
            textAnchor="middle"
            className="fill-stone-400"
            fontSize={10}
          >
            {formatDateShort(data[i].date)}
          </text>
        ))}

        {/* Buy line (red) */}
        <path d={buildLine('buy')} fill="none" stroke="#dc2626" strokeWidth={2} />
        {data.map((d, i) => (
          <circle
            key={`b${i}`}
            cx={xPos(i)}
            cy={yPos(d.buy)}
            r={3}
            fill="#dc2626"
            className="cursor-pointer transition-all hover:r-[5]"
            onMouseEnter={(e) => handleDotHover(e, d, 'buy')}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* Sell line (green) */}
        <path d={buildLine('sell')} fill="none" stroke="#16a34a" strokeWidth={2} />
        {data.map((d, i) => (
          <circle
            key={`s${i}`}
            cx={xPos(i)}
            cy={yPos(d.sell)}
            r={3}
            fill="#16a34a"
            className="cursor-pointer transition-all hover:r-[5]"
            onMouseEnter={(e) => handleDotHover(e, d, 'sell')}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* Invisible larger hit targets for easier hover */}
        {data.map((d, i) => (
          <g key={`hit${i}`}>
            <circle
              cx={xPos(i)}
              cy={yPos(d.buy)}
              r={8}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => handleDotHover(e, d, 'buy')}
              onMouseLeave={() => setTooltip(null)}
            />
            <circle
              cx={xPos(i)}
              cy={yPos(d.sell)}
              r={8}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => handleDotHover(e, d, 'sell')}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 bg-stone-800 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tooltip.color }}
            />
            <span className="font-medium">{tooltip.label}</span>
          </div>
          <div className="font-mono font-semibold mt-0.5">{tooltip.value} VND</div>
          <div className="text-stone-400 mt-0.5">{tooltip.date}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-800" />
        </div>
      )}
    </div>
  )
}

// --- Main component ---

export function GoldPrice() {
  const [prices, setPrices] = useState<Record<string, GoldItem>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState<{ time: string; date: string } | null>(null)
  const [chartType, setChartType] = useState('SJL1L10')
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [chartLoading, setChartLoading] = useState(false)

  const fetchGold = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to fetch gold prices')
      const json: ApiResponse = await res.json()
      if (!json.success) throw new Error('API returned an error')
      setPrices(json.prices)
      setMeta({ time: json.time, date: json.date })
    } catch {
      setError('Could not retrieve gold prices. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async (type: string) => {
    setChartLoading(true)
    try {
      const res = await fetch(`${HISTORY_URL}?type=${type}&days=30`)
      if (!res.ok) return
      const json: HistoryResponse = await res.json()
      if (!json.success) return
      const points: ChartPoint[] = json.history
        .filter((d) => d.prices[type])
        .map((d) => ({
          date: d.date,
          buy: d.prices[type].buy,
          sell: d.prices[type].sell,
        }))
        .reverse()
      setChartData(points)
    } catch {
      setChartData([])
    } finally {
      setChartLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGold()
  }, [fetchGold])

  useEffect(() => {
    fetchHistory(chartType)
  }, [chartType, fetchHistory])

  const entries = Object.entries(prices)
  const domestic = entries.filter(([, v]) => v.currency === 'VND')
  const world = entries.filter(([, v]) => v.currency === 'USD')

  // Build grouped domestic entries; items not in any group go into "Other"
  const groupedCodes = new Set(GROUPS.flatMap((g) => g.codes))
  const ungrouped = domestic.filter(([code]) => !groupedCodes.has(code))
  const groups = [
    ...GROUPS.map((g) => ({
      label: g.label,
      items: g.codes
        .filter((code) => prices[code] && prices[code].currency === 'VND')
        .map((code) => [code, prices[code]] as [string, GoldItem]),
    })).filter((g) => g.items.length > 0),
    ...(ungrouped.length > 0
      ? [{ label: 'Other', items: ungrouped as [string, GoldItem][] }]
      : []),
  ]

  // SJC 9999 highlighted entry
  const sjcMain = prices['SJL1L10']

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      {loading && (
        <div className="bg-white border border-stone-200 rounded-xl p-10 flex items-center justify-center">
          <span className="text-sm text-stone-500">Fetching gold prices...</span>
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-5 flex flex-col items-center gap-3">
          <span className="text-sm text-red-600">{error}</span>
          <button
            onClick={fetchGold}
            className="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <>
          {/* 30-day chart */}
          <div className="bg-white border border-stone-200 rounded-xl">
            <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between rounded-t-xl">
              <span className="text-sm font-medium text-stone-700">
                Last 30 days
              </span>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 bg-white focus:outline-none focus:ring-1 focus:ring-stone-300"
              >
                {domestic.map(([code, item]) => (
                  <option key={code} value={code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-4 py-4">
              {chartLoading ? (
                <div className="flex items-center justify-center h-[260px]">
                  <span className="text-sm text-stone-400">Loading chart...</span>
                </div>
              ) : chartData.length > 1 ? (
                <PriceChart data={chartData} />
              ) : (
                <div className="flex items-center justify-center h-[260px]">
                  <span className="text-sm text-stone-400">No historical data available</span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="px-5 pb-3 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-600 rounded-full" />
                <span className="text-xs text-stone-500">Buy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-green-600 rounded-full" />
                <span className="text-xs text-stone-500">Sell</span>
              </div>
            </div>
          </div>

          {/* Price table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">
                Gold Prices
              </span>
              <div className="flex items-center gap-3">
                {meta && (
                  <span className="text-xs text-stone-400">
                    {meta.date} {meta.time}
                  </span>
                )}
                <button
                  onClick={fetchGold}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                </button>
              </div>
            </div>

            {/* SJC 9999 highlight */}
            {sjcMain && (
              <div className="px-5 py-3 border-b border-stone-200 bg-amber-50/40 grid grid-cols-[1fr_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 items-center">
                <span className="text-sm text-stone-800 font-semibold">SJC 9999</span>
                <div className="text-right">
                  <div className="text-base font-bold text-stone-900 font-mono">
                    {formatPrice(sjcMain.buy, sjcMain.currency)}
                  </div>
                  <div className={`text-[10px] font-mono ${formatChange(sjcMain.change_buy).className}`}>
                    {formatChange(sjcMain.change_buy).text}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-stone-900 font-mono">
                    {formatPrice(sjcMain.sell, sjcMain.currency)}
                  </div>
                  <div className={`text-[10px] font-mono ${formatChange(sjcMain.change_sell).className}`}>
                    {formatChange(sjcMain.change_sell).text}
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="grid grid-cols-[1fr_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 px-5 py-2 border-b border-stone-100 bg-stone-50/50">
              <span className="text-xs text-stone-400 uppercase tracking-wider">Type</span>
              <span className="text-xs text-stone-400 uppercase tracking-wider text-right">Buy</span>
              <span className="text-xs text-stone-400 uppercase tracking-wider text-right">Sell</span>
            </div>

            {/* Grouped rows */}
            {groups.map((group) => (
              <div key={group.label}>
                <div className="px-5 py-1.5 bg-stone-50 border-b border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">{group.label}</span>
                </div>
                <div className="flex flex-col divide-y divide-stone-50">
                  {group.items
                    .filter(([code]) => code !== 'SJL1L10')
                    .map(([code, item]) => {
                      const chBuy = formatChange(item.change_buy)
                      const chSell = formatChange(item.change_sell)
                      return (
                        <div
                          key={code}
                          className="grid grid-cols-[1fr_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 px-5 py-2.5 items-center hover:bg-stone-50/50 transition-colors"
                        >
                          <span className="text-sm text-stone-700 font-medium">{item.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-stone-800 font-mono">
                              {formatPrice(item.buy, item.currency)}
                            </div>
                            <div className={`text-[10px] font-mono ${chBuy.className}`}>{chBuy.text}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-stone-800 font-mono">
                              {formatPrice(item.sell, item.currency)}
                            </div>
                            <div className={`text-[10px] font-mono ${chSell.className}`}>{chSell.text}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}

            {/* World gold row */}
            {world.length > 0 && (
              <div>
                <div className="px-5 py-1.5 bg-stone-50 border-t border-b border-stone-100">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">World</span>
                </div>
                {world.map(([code, item]) => {
                  const chBuy = formatChange(item.change_buy)
                  return (
                    <div key={code} className="px-5 py-2.5 flex items-center justify-between bg-amber-50/30">
                      <span className="text-sm text-stone-700 font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-800 font-mono">
                          {formatPrice(item.buy, item.currency)}
                        </span>
                        <span className={`text-[10px] font-mono ${chBuy.className}`}>{chBuy.text}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="px-5 py-1.5 border-t border-stone-100 bg-stone-50/50">
              <span className="text-[10px] text-stone-400 italic">Unit: VND/luong (domestic), USD/oz (world)</span>
            </div>
          </div>

          <button
            onClick={() => { fetchGold(); fetchHistory(chartType) }}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Refresh All
          </button>
        </>
      )}
    </div>
  )
}
