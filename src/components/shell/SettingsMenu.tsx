'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage, LOCALE_LABELS, LOCALE_FLAGS } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

export function SettingsMenu() {
  const { locale, setLocale, t } = useLanguage()
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showModal) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowModal(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showModal])

  const locales: Locale[] = ['en', 'vi']

  return (
    <>
      {/* Trigger button */}
      <div className="relative">
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label={t.settings}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 1.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.3a5.52 5.52 0 0 1 1.46.6l.21-.21a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1 0 1.06l-.21.21c.26.45.46.94.6 1.46h.3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.3a5.52 5.52 0 0 1-.6 1.46l.21.21a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0l-.21-.21c-.45.26-.94.46-1.46.6v.3a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-.3a5.52 5.52 0 0 1-1.46-.6l-.21.21a.75.75 0 0 1-1.06 0L2.71 12.1a.75.75 0 0 1 0-1.06l.21-.21a5.52 5.52 0 0 1-.6-1.46h-.3A.75.75 0 0 1 1.27 8.6v-1.5a.75.75 0 0 1 .75-.75h.3c.14-.52.34-1.01.6-1.46l-.21-.21a.75.75 0 0 1 0-1.06L3.77 2.56a.75.75 0 0 1 1.06 0l.21.21c.45-.26.94-.46 1.46-.6v-.3ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Hover tooltip */}
        {showTooltip && !showModal && (
          <div className="absolute right-0 top-full mt-1.5 px-2 py-1 bg-stone-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
            {t.settings}
          </div>
        )}
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl border border-stone-200 w-[340px] overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">{t.settings}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={t.close}
              >
                <svg width="14" height="14" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Language section */}
            <div className="px-5 py-4">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {t.language}
              </label>
              <div className="mt-3 flex flex-col gap-1.5">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      locale === l
                        ? 'bg-stone-100 text-stone-800 font-medium'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{LOCALE_FLAGS[l]}</span>
                    <span>{LOCALE_LABELS[l]}</span>
                    {locale === l && (
                      <svg className="ml-auto text-stone-500" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
