'use client'

import { useState, useEffect, useCallback } from 'react'

interface IpData {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  timezone: string
  postal: string
}

export function IpInfo() {
  const [data, setData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchIp = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://ipinfo.io/json')
      if (!res.ok) throw new Error('Failed to fetch IP info')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Could not retrieve IP information. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIp()
  }, [fetchIp])

  const handleCopy = useCallback(async () => {
    if (!data) return
    await navigator.clipboard.writeText(data.ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [data])

  const [lat, lon] = data?.loc?.split(',') ?? []

  const details = data
    ? [
        { label: 'City', value: data.city },
        { label: 'Region', value: data.region },
        { label: 'Country', value: data.country },
        { label: 'Postal Code', value: data.postal },
        { label: 'Coordinates', value: data.loc },
        { label: 'Timezone', value: data.timezone },
        { label: 'Organization', value: data.org },
      ]
    : []

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {loading && (
        <div className="bg-white border border-stone-200 rounded-xl p-10 flex items-center justify-center">
          <span className="text-sm text-stone-500">Fetching your IP info...</span>
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-5 flex flex-col items-center gap-3">
          <span className="text-sm text-red-600">{error}</span>
          <button
            onClick={fetchIp}
            className="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs text-stone-500 uppercase tracking-wider">Your IP Address</span>
            <span className="text-3xl font-semibold text-stone-800 font-mono">{data.ip}</span>
            <button
              onClick={handleCopy}
              className="mt-1 text-xs text-stone-500 hover:text-stone-800 transition-colors px-3 py-1 rounded hover:bg-stone-100"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex flex-col divide-y divide-stone-100">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-stone-500">{d.label}</span>
                  <span className="text-sm font-medium text-stone-700">{d.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {lat && lon && (
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-stone-100">
                <span className="text-xs text-stone-400">Approximate Location</span>
              </div>
              <iframe
                title="IP Location Map"
                width="100%"
                height="260"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(lon) - 0.05},${Number(lat) - 0.05},${Number(lon) + 0.05},${Number(lat) + 0.05}&layer=mapnik&marker=${lat},${lon}`}
              />
            </div>
          )}

          <button
            onClick={fetchIp}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Refresh
          </button>
        </>
      )}
    </div>
  )
}
