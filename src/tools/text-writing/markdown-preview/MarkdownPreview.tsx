'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseInline(text: string): string {
  let result = escapeHtml(text)

  // inline code (must come before bold/italic to avoid conflicts)
  result = result.replace(/`([^`]+)`/g, '<code class="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

  // bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return result
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const htmlParts: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // code block
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      i++ // skip closing ```
      htmlParts.push(
        `<pre class="bg-stone-100 border border-stone-200 rounded-lg p-3 overflow-x-auto"><code class="text-sm font-mono text-stone-800">${codeLines.join('\n')}</code></pre>`
      )
      continue
    }

    // horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      htmlParts.push('<hr class="border-stone-300 my-4" />')
      i++
      continue
    }

    // headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = parseInline(headingMatch[2])
      const sizes: Record<number, string> = {
        1: 'text-2xl font-bold',
        2: 'text-xl font-bold',
        3: 'text-lg font-semibold',
        4: 'text-base font-semibold',
        5: 'text-sm font-semibold',
        6: 'text-sm font-medium',
      }
      htmlParts.push(
        `<h${level} class="${sizes[level]} text-stone-800 mt-4 mb-2">${text}</h${level}>`
      )
      i++
      continue
    }

    // blockquote
    if (line.startsWith('&gt; ') || line === '&gt;') {
      // We need to check the raw line, not escaped
      // Actually let's check the raw line instead
    }
    if (lines[i] !== undefined) {
      const rawLine = lines[i]
      if (rawLine.startsWith('> ')) {
        const quoteLines: string[] = []
        while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''))
          i++
        }
        htmlParts.push(
          `<blockquote class="border-l-4 border-stone-300 pl-4 py-1 text-stone-600 italic my-2">${quoteLines.map(parseInline).join('<br />')}</blockquote>`
        )
        continue
      }
    }

    // unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(parseInline(lines[i].replace(/^[-*]\s+/, '')))
        i++
      }
      htmlParts.push(
        `<ul class="list-disc list-inside space-y-1 my-2 text-stone-700">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
      )
      continue
    }

    // ordered list
    const olMatch = line.match(/^\d+\.\s+/)
    if (olMatch) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\.\s+/, '')))
        i++
      }
      htmlParts.push(
        `<ol class="list-decimal list-inside space-y-1 my-2 text-stone-700">${items.map((item) => `<li>${item}</li>`).join('')}</ol>`
      )
      continue
    }

    // empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // paragraph
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].startsWith('- ') && !lines[i].startsWith('* ') && !/^\d+\.\s+/.test(lines[i]) && !lines[i].startsWith('> ') && !/^-{3,}$/.test(lines[i].trim())) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      htmlParts.push(
        `<p class="text-stone-700 leading-relaxed my-2">${paraLines.map(parseInline).join('<br />')}</p>`
      )
    }
  }

  return htmlParts.join('\n')
}

const DEFAULT_MD = `# Markdown Preview

Write your **Markdown** on the left and see it *rendered* on the right.

## Features

- Headings (h1 through h6)
- **Bold** and *italic* text
- \`Inline code\` and code blocks
- [Links](https://example.com)
- Unordered and ordered lists
- Blockquotes
- Horizontal rules

---

> This is a blockquote.

1. First item
2. Second item
3. Third item

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`
`

export function MarkdownPreview() {
  const { t } = useLanguage()
  const [markdown, setMarkdown] = useState(DEFAULT_MD)

  const html = useMemo(() => markdownToHtml(markdown), [markdown])

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 min-h-[500px]">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">{t.tool.markdownPreview.markdown}</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t.tool.markdownPreview.placeholder}
            className="flex-1 w-full p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400 font-mono"
            spellCheck={false}
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-stone-100">
            <span className="text-xs text-stone-400">{t.tool.markdownPreview.preview}</span>
          </div>
          <div
            className="flex-1 p-4 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
