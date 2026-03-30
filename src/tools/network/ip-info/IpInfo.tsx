'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n'

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
  const { t } = useLanguage()
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
      setError(t.tool.ipInfo.errorMsg)
    } finally {
      setLoading(false)
    }
  }, [t])

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
        { label: t.tool.ipInfo.city, value: data.city },
        { label: t.tool.ipInfo.region, value: data.region },
        { label: t.tool.ipInfo.country, value: data.country },
        { label: t.tool.ipInfo.postalCode, value: data.postal },
        { label: t.tool.ipInfo.coordinates, value: data.loc },
        { label: t.tool.ipInfo.timezone, value: data.timezone },
        { label: t.tool.ipInfo.organization, value: data.org },
      ]
    : []

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {loading && (
        <div className="bg-white border border-stone-200 rounded-xl p-10 flex items-center justify-center">
          <span className="text-sm text-stone-500">{t.tool.ipInfo.fetching}</span>
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-5 flex flex-col items-center gap-3">
          <span className="text-sm text-red-600">{error}</span>
          <button
            onClick={fetchIp}
            className="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white rounded-lg transition-colors"
          >
            {t.tool.common.retry}
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.ipInfo.yourIp}</span>
            <span className="text-3xl font-semibold text-stone-800 font-mono">{data.ip}</span>
            <button
              onClick={handleCopy}
              className="mt-1 text-xs text-stone-500 hover:text-stone-800 transition-colors px-3 py-1 rounded hover:bg-stone-100"
            >
              {copied ? t.tool.common.copied : t.tool.common.copyToClipboard}
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
                <span className="text-xs text-stone-400">{t.tool.ipInfo.approximateLocation}</span>
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
            {t.tool.common.refresh}
          </button>
        </>
      )}
    </div>
  )
}
