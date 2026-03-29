'use client'

import { useState, useMemo } from 'react'

interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  return atob(base64)
}

const CLAIM_LABELS: Record<string, string> = {
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expiration Time',
  nbf: 'Not Before',
  iat: 'Issued At',
  jti: 'JWT ID',
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== 'number') return null
  try {
    return new Date(value * 1000).toLocaleString()
  } catch {
    return null
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState('')

  const result = useMemo<{ decoded: DecodedJwt; error: null } | { decoded: null; error: string }>(() => {
    if (!token.trim()) return { decoded: null, error: '' }

    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      return { decoded: null, error: 'Invalid JWT: expected 3 parts separated by dots' }
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]))
      const payload = JSON.parse(base64UrlDecode(parts[1]))
      const signature = parts[2]

      return { decoded: { header, payload, signature }, error: null }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to decode token'
      return { decoded: null, error: msg }
    }
  }, [token])

  const expiryStatus = useMemo(() => {
    if (!result.decoded) return null
    const exp = result.decoded.payload.exp
    if (typeof exp !== 'number') return null

    const expiryDate = new Date(exp * 1000)
    const now = new Date()
    const isExpired = expiryDate < now

    return {
      isExpired,
      date: expiryDate.toLocaleString(),
    }
  }, [result.decoded])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="w-full h-32 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400 break-all"
        />
      </div>

      {result.error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-700">
          {result.error}
        </div>
      )}

      {expiryStatus && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            expiryStatus.isExpired
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}
        >
          {expiryStatus.isExpired
            ? `Token expired on ${expiryStatus.date}`
            : `Token valid until ${expiryStatus.date}`}
        </div>
      )}

      {result.decoded && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-blue-200">
              <span className="text-xs text-blue-600 uppercase tracking-wider font-medium">
                Header
              </span>
            </div>
            <pre className="p-4 text-sm text-blue-800 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(result.decoded.header, null, 2)}
            </pre>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-purple-200">
              <span className="text-xs text-purple-600 uppercase tracking-wider font-medium">
                Payload
              </span>
            </div>
            <pre className="p-4 text-sm text-purple-800 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(result.decoded.payload, null, 2)}
            </pre>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-stone-100">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                Signature
              </span>
            </div>
            <pre className="p-4 text-sm text-stone-600 font-mono whitespace-pre-wrap break-all">
              {result.decoded.signature}
            </pre>
          </div>

          {Object.keys(result.decoded.payload).some((k) => k in CLAIM_LABELS) && (
            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <span className="text-xs text-stone-500 uppercase tracking-wider block mb-3">
                Standard Claims
              </span>
              <div className="flex flex-col gap-2">
                {Object.entries(result.decoded.payload)
                  .filter(([k]) => k in CLAIM_LABELS)
                  .map(([key, value]) => {
                    const timestamp = ['exp', 'nbf', 'iat'].includes(key)
                      ? formatTimestamp(value)
                      : null
                    return (
                      <div key={key} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-stone-500">
                          {CLAIM_LABELS[key]}{' '}
                          <span className="font-mono text-xs text-stone-400">({key})</span>
                        </span>
                        <span className="text-sm font-medium text-stone-700">
                          {timestamp ?? String(value)}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
