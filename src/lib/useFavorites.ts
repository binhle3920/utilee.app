'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'utilee_favorites'

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '[]'
}

function getServerSnapshot(): string {
  return '[]'
}

let listeners: Array<() => void> = []

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function setStored(value: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  emitChange()
}

export function useFavorites() {
  const storeValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const favorites: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(storeValue)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [storeValue])

  const isFavorite = useCallback(
    (slug: string): boolean => favorites.includes(slug),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (slug: string): void => {
      const next = favorites.includes(slug)
        ? favorites.filter((s) => s !== slug)
        : [...favorites, slug]
      setStored(next)
    },
    [favorites]
  )

  return { favorites, isFavorite, toggleFavorite }
}
