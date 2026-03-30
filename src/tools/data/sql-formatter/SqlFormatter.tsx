'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
  'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'SET', 'VALUES',
  'INTO', 'LIMIT', 'OFFSET', 'UNION', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'AS', 'IN',
  'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'EXISTS', 'DISTINCT', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
]

// Major clauses get a newline before them
const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE',
  'CREATE', 'ALTER', 'DROP', 'SET', 'VALUES', 'INTO', 'LIMIT', 'OFFSET', 'UNION',
]

// Sub-clauses get indentation
const SUB_CLAUSES = ['AND', 'OR', 'ON', 'WHEN', 'THEN', 'ELSE', 'END']

function formatSQL(input: string): string {
  if (!input.trim()) return ''

  // Tokenize: preserve strings, identifiers, and whitespace boundaries
  const tokens: string[] = []
  let i = 0
  const src = input.trim()

  while (i < src.length) {
    // Skip whitespace
    if (/\s/.test(src[i])) {
      i++
      continue
    }

    // String literals (single or double quoted)
    if (src[i] === "'" || src[i] === '"') {
      const quote = src[i]
      let j = i + 1
      while (j < src.length && src[j] !== quote) {
        if (src[j] === '\\') j++
        j++
      }
      tokens.push(src.slice(i, j + 1))
      i = j + 1
      continue
    }

    // Parentheses and commas
    if ('(),;'.includes(src[i])) {
      tokens.push(src[i])
      i++
      continue
    }

    // Word or operator
    let j = i
    while (j < src.length && !/[\s(),;'"']/.test(src[j])) {
      j++
    }
    if (j > i) {
      tokens.push(src.slice(i, j))
      i = j
    }
  }

  // Uppercase keywords and build formatted output
  const uppercasedTokens = tokens.map((token) => {
    // Don't touch string literals
    if (
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('"') && token.endsWith('"'))
    ) {
      return token
    }
    const upper = token.toUpperCase()
    if (KEYWORDS.includes(upper)) return upper
    return token
  })

  // Build output with newlines and indentation
  const lines: string[] = []
  let currentLine = ''
  const indent = '  '

  for (let idx = 0; idx < uppercasedTokens.length; idx++) {
    const token = uppercasedTokens[idx]

    // Check for two-word major clauses
    const nextToken = idx + 1 < uppercasedTokens.length ? uppercasedTokens[idx + 1] : ''
    const twoWord = `${token} ${nextToken}`
    const isTwoWordClause = MAJOR_CLAUSES.includes(twoWord)

    if (isTwoWordClause) {
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = twoWord
      idx++ // skip next token
      continue
    }

    if (MAJOR_CLAUSES.includes(token)) {
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = token
      continue
    }

    if (SUB_CLAUSES.includes(token)) {
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = indent + token
      continue
    }

    if (token === ',') {
      currentLine += ','
      continue
    }

    if (token === '(') {
      currentLine += ' ('
      continue
    }

    if (token === ')') {
      currentLine += ')'
      continue
    }

    if (token === ';') {
      currentLine += ';'
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = ''
      lines.push('')
      continue
    }

    currentLine += (currentLine.trim() ? ' ' : '') + token
  }

  if (currentLine.trim()) lines.push(currentLine)

  return lines.join('\n')
}

export function SqlFormatter() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleFormat = () => {
    setOutput(formatSQL(input))
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.tool.sql.placeholder}
          className="w-full h-48 p-4 text-sm text-stone-700 font-mono leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
        >
          {t.tool.common.format}
        </button>
      </div>

      {output && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
            <span className="text-xs text-stone-500 uppercase tracking-wider">{t.tool.sql.formattedSql}</span>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              {copied ? t.tool.common.copied : t.tool.common.copy}
            </button>
          </div>
          <pre className="p-4 text-sm text-stone-700 font-mono whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
