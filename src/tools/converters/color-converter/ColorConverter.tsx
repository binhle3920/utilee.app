'use client'

import { useState, useCallback } from 'react'

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace(/^#/, '')
  let full = clean
  if (full.length === 3) {
    full = full[0] + full[0] + full[1] + full[1] + full[2] + full[2]
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function ColorConverter() {
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 })
  const [hexInput, setHexInput] = useState('#3b82f6')
  const [copied, setCopied] = useState<string | null>(null)

  const hsl = rgbToHsl(rgb)
  const hex = rgbToHex(rgb)

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setRgb(newRgb)
    setHexInput(rgbToHex(newRgb))
  }, [])

  const updateFromHex = useCallback((value: string) => {
    setHexInput(value)
    const parsed = hexToRgb(value)
    if (parsed) {
      setRgb(parsed)
    }
  }, [])

  const updateFromHsl = useCallback((newHsl: HSL) => {
    const newRgb = hslToRgb(newHsl)
    setRgb(newRgb)
    setHexInput(rgbToHex(newRgb))
  }, [])

  const updateFromPicker = useCallback((value: string) => {
    setHexInput(value)
    const parsed = hexToRgb(value)
    if (parsed) {
      setRgb(parsed)
    }
  }, [])

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Color preview */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center gap-3">
        <span className="text-xs text-stone-500 uppercase tracking-wider">Preview</span>
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-xl border border-stone-200 shadow-inner"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromPicker(e.target.value)}
            className="w-12 h-12 rounded-lg border border-stone-200 cursor-pointer"
          />
        </div>
      </div>

      {/* HEX input */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 uppercase tracking-wider">HEX</span>
          <button
            onClick={() => handleCopy(hex, 'hex')}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {copied === 'hex' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => updateFromHex(e.target.value)}
          placeholder="#000000"
          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* RGB inputs */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 uppercase tracking-wider">RGB</span>
          <button
            onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {copied === 'rgb' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['r', 'g', 'b'] as const).map((channel) => (
            <div key={channel} className="flex flex-col gap-1.5">
              <label className="text-xs text-stone-500 uppercase">{channel}</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[channel]}
                onChange={(e) => {
                  const val = clamp(Number(e.target.value) || 0, 0, 255)
                  updateFromRgb({ ...rgb, [channel]: val })
                }}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors"
              />
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[channel]}
                onChange={(e) => {
                  updateFromRgb({ ...rgb, [channel]: Number(e.target.value) })
                }}
                className="w-full accent-stone-700"
              />
            </div>
          ))}
        </div>
        <p className="text-sm font-mono text-stone-600">
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </p>
      </div>

      {/* HSL inputs */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 uppercase tracking-wider">HSL</span>
          <button
            onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {copied === 'hsl' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'h' as const, label: 'H', max: 360, unit: '\u00B0' },
            { key: 's' as const, label: 'S', max: 100, unit: '%' },
            { key: 'l' as const, label: 'L', max: 100, unit: '%' },
          ]).map(({ key, label, max, unit }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs text-stone-500 uppercase">{label} ({unit})</label>
              <input
                type="number"
                min={0}
                max={max}
                value={hsl[key]}
                onChange={(e) => {
                  const val = clamp(Number(e.target.value) || 0, 0, max)
                  updateFromHsl({ ...hsl, [key]: val })
                }}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-200 text-stone-700 outline-none focus:border-stone-400 transition-colors"
              />
              <input
                type="range"
                min={0}
                max={max}
                value={hsl[key]}
                onChange={(e) => {
                  updateFromHsl({ ...hsl, [key]: Number(e.target.value) })
                }}
                className="w-full accent-stone-700"
              />
            </div>
          ))}
        </div>
        <p className="text-sm font-mono text-stone-600">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </p>
      </div>
    </div>
  )
}
