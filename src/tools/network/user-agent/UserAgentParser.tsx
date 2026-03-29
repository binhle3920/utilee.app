'use client'

import { useState, useEffect, useMemo } from 'react'

interface ParsedUA {
  browser: { name: string; version: string }
  os: { name: string; version: string }
  engine: string
  deviceType: string
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    engine: 'Unknown',
    deviceType: 'Desktop',
  }

  if (!ua) return result

  // Device type
  if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(ua)) {
    result.deviceType = 'Mobile'
  } else if (/Tablet|iPad/i.test(ua)) {
    result.deviceType = 'Tablet'
  } else {
    result.deviceType = 'Desktop'
  }

  // Engine
  if (/Edg/i.test(ua)) {
    result.engine = 'Blink'
  } else if (/OPR|Opera/i.test(ua)) {
    result.engine = 'Blink'
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    result.engine = 'Blink'
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    result.engine = 'WebKit'
  } else if (/Firefox/i.test(ua)) {
    result.engine = 'Gecko'
  } else if (/Trident/i.test(ua)) {
    result.engine = 'Trident'
  }

  // Browser detection (order matters)
  let match: RegExpMatchArray | null

  if ((match = ua.match(/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/))) {
    result.browser = { name: 'Microsoft Edge', version: match[1] }
  } else if ((match = ua.match(/OPR\/(\d+[\d.]*)/))) {
    result.browser = { name: 'Opera', version: match[1] }
  } else if ((match = ua.match(/Opera\/(\d+[\d.]*)/))) {
    result.browser = { name: 'Opera', version: match[1] }
  } else if ((match = ua.match(/Firefox\/(\d+[\d.]*)/))) {
    result.browser = { name: 'Firefox', version: match[1] }
  } else if ((match = ua.match(/Chrome\/(\d+[\d.]*)/))) {
    result.browser = { name: 'Chrome', version: match[1] }
  } else if ((match = ua.match(/Version\/(\d+[\d.]*).*Safari/))) {
    result.browser = { name: 'Safari', version: match[1] }
  } else if (/Safari/i.test(ua)) {
    result.browser = { name: 'Safari', version: '' }
  } else if ((match = ua.match(/MSIE\s(\d+[\d.]*)/))) {
    result.browser = { name: 'Internet Explorer', version: match[1] }
  } else if (/Trident/i.test(ua)) {
    const rv = ua.match(/rv:(\d+[\d.]*)/)
    result.browser = { name: 'Internet Explorer', version: rv ? rv[1] : '' }
  }

  // OS detection
  if ((match = ua.match(/Windows NT (\d+[\d.]*)/))) {
    const versions: Record<string, string> = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
    }
    result.os = { name: 'Windows', version: versions[match[1]] || match[1] }
  } else if ((match = ua.match(/Mac OS X (\d+[._\d]*)/))) {
    result.os = { name: 'macOS', version: match[1].replace(/_/g, '.') }
  } else if ((match = ua.match(/Android (\d+[\d.]*)/))) {
    result.os = { name: 'Android', version: match[1] }
  } else if ((match = ua.match(/iPhone OS (\d+[_\d]*)/)) || (match = ua.match(/CPU OS (\d+[_\d]*)/))) {
    result.os = { name: 'iOS', version: match[1].replace(/_/g, '.') }
  } else if (/Linux/i.test(ua)) {
    result.os = { name: 'Linux', version: '' }
  } else if (/CrOS/i.test(ua)) {
    result.os = { name: 'Chrome OS', version: '' }
  }

  return result
}

export function UserAgentParser() {
  const [uaString, setUaString] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUaString(navigator.userAgent)
    }
  }, [])

  const parsed = useMemo(() => parseUserAgent(uaString), [uaString])

  const handleReset = () => {
    if (typeof navigator !== 'undefined') {
      setUaString(navigator.userAgent)
      setIsCustom(false)
    }
  }

  const cards = [
    {
      label: 'Browser',
      icon: '🌐',
      items: [
        { label: 'Name', value: parsed.browser.name },
        { label: 'Version', value: parsed.browser.version || 'Unknown' },
      ],
    },
    {
      label: 'Operating System',
      icon: '💻',
      items: [
        { label: 'Name', value: parsed.os.name },
        { label: 'Version', value: parsed.os.version || 'Unknown' },
      ],
    },
    {
      label: 'Engine',
      icon: '⚙️',
      items: [{ label: 'Rendering Engine', value: parsed.engine }],
    },
    {
      label: 'Device',
      icon: '📱',
      items: [{ label: 'Type', value: parsed.deviceType }],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* UA Input */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-stone-500 uppercase tracking-wider">User Agent String</label>
          {isCustom && (
            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-3 py-1 rounded hover:bg-stone-100"
            >
              Reset to current browser
            </button>
          )}
        </div>
        <textarea
          value={uaString}
          onChange={(e) => {
            setUaString(e.target.value)
            setIsCustom(true)
          }}
          rows={3}
          placeholder="Paste a user agent string here..."
          className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
        />
        {!isCustom && (
          <span className="text-xs text-stone-400">Showing your current browser&apos;s user agent.</span>
        )}
      </div>

      {/* Result Cards */}
      {uaString && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{card.icon}</span>
                <span className="text-sm font-medium text-stone-700">{card.label}</span>
              </div>
              <div className="flex flex-col gap-2">
                {card.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">{item.label}</span>
                    <span className="text-sm font-medium text-stone-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raw String Card */}
      {uaString && (
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-500 uppercase tracking-wider">Raw String</span>
            <span className="text-xs text-stone-400">{uaString.length} characters</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600 font-mono leading-relaxed break-all">
            {uaString}
          </div>
        </div>
      )}
    </div>
  )
}
