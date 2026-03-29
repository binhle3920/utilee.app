'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useDeepLink() {
  const router = useRouter()

  useEffect(() => {
    let unlisten: (() => void) | undefined

    async function setup() {
      // Only run inside Tauri
      if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) return

      const { listen } = await import('@tauri-apps/api/event')

      unlisten = await listen<string>('deep-link', (event) => {
        const url = event.payload
        // Parse utilee://tools/slug → /tools/slug
        try {
          const parsed = new URL(url)
          const path = parsed.pathname.replace(/^\/\//, '/')
          if (path) {
            router.push(`/${parsed.host}${path}`)
          }
        } catch {
          // utilee://tools/slug may parse as host=tools, pathname=/slug
          // or it may not be a valid URL at all — try a simple approach
          const match = url.match(/^utilee:\/\/(.+)/)
          if (match) {
            router.push(`/${match[1]}`)
          }
        }
      })

      // Also check for launch URL via deep-link plugin
      try {
        const { getCurrent } = await import('@tauri-apps/plugin-deep-link')
        const urls = await getCurrent()
        if (urls?.length) {
          const match = urls[0].match(/^utilee:\/\/(.+)/)
          if (match) {
            router.push(`/${match[1]}`)
          }
        }
      } catch {
        // plugin may not be available in dev
      }
    }

    setup()

    return () => {
      unlisten?.()
    }
  }, [router])
}
