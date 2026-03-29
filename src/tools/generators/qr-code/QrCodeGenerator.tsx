'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

// ── Minimal QR Code Encoder (Byte mode, ECC level M) ──────────────────────

// Generator polynomials for Reed-Solomon (precomputed for common ECC codeword counts)
// GF(2^8) with primitive polynomial 0x11d

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)

;(function initGaloisField() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x = x << 1
    if (x >= 256) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255]
  }
})()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

function rsGeneratorPoly(nsym: number): Uint8Array {
  let g = new Uint8Array([1])
  for (let i = 0; i < nsym; i++) {
    const newG = new Uint8Array(g.length + 1)
    for (let j = 0; j < g.length; j++) {
      newG[j] ^= g[j]
      newG[j + 1] ^= gfMul(g[j], GF_EXP[i])
    }
    g = newG
  }
  return g
}

function rsEncode(data: Uint8Array, nsym: number): Uint8Array {
  const gen = rsGeneratorPoly(nsym)
  const out = new Uint8Array(data.length + nsym)
  out.set(data)
  for (let i = 0; i < data.length; i++) {
    const coef = out[i]
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        out[i + j] ^= gfMul(gen[j], coef)
      }
    }
  }
  return out.slice(data.length)
}

// QR version info: [version, size, totalCodewords, eccCodewordsPerBlock, numBlocks, dataCodewordsPerBlock]
// ECC Level M only
const VERSION_TABLE: [number, number, number, number, number, number][] = [
  [1, 21, 26, 10, 1, 16],
  [2, 25, 44, 16, 1, 28],
  [3, 29, 70, 26, 1, 44],
  [4, 33, 100, 18, 2, 32],
  [5, 37, 134, 24, 2, 43],
  [6, 41, 172, 16, 4, 27],
  [7, 45, 196, 18, 4, 31],
  [8, 49, 242, 22, 4, 38],  // 2 blocks of 36 + 2 blocks of 37
  [9, 53, 292, 22, 4, 36],  // more complex blocking
  [10, 57, 346, 26, 4, 43], // 2+2 blocks
]

// Simplified: for versions 1-7 use single block group, for 8+ approximate
interface VersionInfo {
  version: number
  size: number
  totalCodewords: number
  eccPerBlock: number
  dataCapacity: number
  blocks: { count: number; dataCodewords: number }[]
}

function getVersionInfo(version: number): VersionInfo {
  // Detailed ECC M block structure for versions 1-10
  const blockStructures: Record<number, { count: number; dataCodewords: number }[]> = {
    1: [{ count: 1, dataCodewords: 16 }],
    2: [{ count: 1, dataCodewords: 28 }],
    3: [{ count: 1, dataCodewords: 44 }],
    4: [{ count: 2, dataCodewords: 32 }],
    5: [{ count: 2, dataCodewords: 43 }],
    6: [{ count: 4, dataCodewords: 27 }],
    7: [{ count: 4, dataCodewords: 31 }],
    8: [{ count: 2, dataCodewords: 38 }, { count: 2, dataCodewords: 39 }],
    9: [{ count: 3, dataCodewords: 36 }, { count: 2, dataCodewords: 37 }],
    10: [{ count: 4, dataCodewords: 43 }, { count: 1, dataCodewords: 44 }],
  }

  const vt = VERSION_TABLE[version - 1]
  const blocks = blockStructures[version] || [{ count: vt[4], dataCodewords: vt[5] }]
  const dataCapacity = blocks.reduce((sum, b) => sum + b.count * b.dataCodewords, 0)

  return {
    version: vt[0],
    size: vt[1],
    totalCodewords: vt[2],
    eccPerBlock: vt[3],
    dataCapacity,
    blocks,
  }
}

function selectVersion(dataLength: number): VersionInfo {
  // Byte mode: 4 bits mode + character count indicator + data + terminator
  for (let v = 1; v <= 10; v++) {
    const info = getVersionInfo(v)
    const cciBits = v <= 9 ? 8 : 16
    const headerBits = 4 + cciBits
    const availableBits = info.dataCapacity * 8
    const dataBits = headerBits + dataLength * 8
    if (dataBits + 4 <= availableBits) return info // +4 for terminator
  }
  return getVersionInfo(10) // fallback
}

function encodeData(text: string, versionInfo: VersionInfo): Uint8Array {
  const bytes = new TextEncoder().encode(text)
  const cciBits = versionInfo.version <= 9 ? 8 : 16

  // Build bit stream
  const bits: number[] = []
  function pushBits(value: number, count: number) {
    for (let i = count - 1; i >= 0; i--) {
      bits.push((value >> i) & 1)
    }
  }

  // Mode indicator: byte mode = 0100
  pushBits(0b0100, 4)
  // Character count
  pushBits(bytes.length, cciBits)
  // Data
  for (const b of bytes) pushBits(b, 8)
  // Terminator (up to 4 zeros)
  const capacity = versionInfo.dataCapacity * 8
  const termLen = Math.min(4, capacity - bits.length)
  for (let i = 0; i < termLen; i++) bits.push(0)

  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0)

  // Convert to bytes
  const dataBytes: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0)
    dataBytes.push(byte)
  }

  // Pad with alternating 0xEC, 0x11
  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (dataBytes.length < versionInfo.dataCapacity) {
    dataBytes.push(padBytes[padIdx % 2])
    padIdx++
  }

  return new Uint8Array(dataBytes)
}

function interleaveBlocks(data: Uint8Array, versionInfo: VersionInfo): Uint8Array {
  const blocks: { data: Uint8Array; ecc: Uint8Array }[] = []
  let offset = 0

  for (const group of versionInfo.blocks) {
    for (let i = 0; i < group.count; i++) {
      const blockData = data.slice(offset, offset + group.dataCodewords)
      offset += group.dataCodewords
      const ecc = rsEncode(blockData, versionInfo.eccPerBlock)
      blocks.push({ data: blockData, ecc })
    }
  }

  // Interleave data codewords
  const result: number[] = []
  const maxDataLen = Math.max(...blocks.map((b) => b.data.length))
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of blocks) {
      if (i < block.data.length) result.push(block.data[i])
    }
  }
  // Interleave ECC codewords
  for (let i = 0; i < versionInfo.eccPerBlock; i++) {
    for (const block of blocks) {
      if (i < block.ecc.length) result.push(block.ecc[i])
    }
  }

  return new Uint8Array(result)
}

// Alignment pattern positions per version
const ALIGNMENT_POSITIONS: Record<number, number[]> = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 52],
}

function createMatrix(size: number): { matrix: number[][]; reserved: boolean[][] } {
  const matrix = Array.from({ length: size }, () => new Array(size).fill(0))
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false))
  return { matrix, reserved }
}

function placeFinderPattern(matrix: number[][], reserved: boolean[][], row: number, col: number) {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ]
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const mr = row + r
      const mc = col + c
      if (mr >= 0 && mr < matrix.length && mc >= 0 && mc < matrix.length) {
        matrix[mr][mc] = pattern[r][c]
        reserved[mr][mc] = true
      }
    }
  }
}

function placeSeparators(matrix: number[][], reserved: boolean[][], size: number) {
  // Horizontal and vertical separators around finder patterns
  for (let i = 0; i < 8; i++) {
    // Top-left
    if (i < size) {
      matrix[7][i] = 0; reserved[7][i] = true
      matrix[i][7] = 0; reserved[i][7] = true
    }
    // Top-right
    if (size - 8 + i < size) {
      matrix[7][size - 8 + i] = 0; reserved[7][size - 8 + i] = true
    }
    if (i < size) {
      matrix[i][size - 8] = 0; reserved[i][size - 8] = true
    }
    // Bottom-left
    if (size - 8 + i < size) {
      matrix[size - 8 + i][7] = 0; reserved[size - 8 + i][7] = true
    }
    if (i < size) {
      matrix[size - 8][i] = 0; reserved[size - 8][i] = true
    }
  }
}

function placeTimingPatterns(matrix: number[][], reserved: boolean[][], size: number) {
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0 ? 1 : 0
    if (!reserved[6][i]) {
      matrix[6][i] = val
      reserved[6][i] = true
    }
    if (!reserved[i][6]) {
      matrix[i][6] = val
      reserved[i][6] = true
    }
  }
}

function placeAlignmentPatterns(matrix: number[][], reserved: boolean[][], version: number) {
  if (version < 2) return
  const positions = ALIGNMENT_POSITIONS[version]
  if (!positions) return

  for (const row of positions) {
    for (const col of positions) {
      // Skip if overlapping with finder patterns
      if (row <= 8 && col <= 8) continue
      if (row <= 8 && col >= matrix.length - 8) continue
      if (row >= matrix.length - 8 && col <= 8) continue

      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const isEdge = Math.abs(r) === 2 || Math.abs(c) === 2
          const isCenter = r === 0 && c === 0
          matrix[row + r][col + c] = isEdge || isCenter ? 1 : 0
          reserved[row + r][col + c] = true
        }
      }
    }
  }
}

function reserveFormatInfo(reserved: boolean[][], size: number) {
  // Around top-left finder
  for (let i = 0; i < 9; i++) {
    if (i < size) reserved[8][i] = true
    if (i < size) reserved[i][8] = true
  }
  // Around top-right finder
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true
  }
  // Around bottom-left finder
  for (let i = 0; i < 7; i++) {
    reserved[size - 1 - i][8] = true
  }
  // Dark module
  reserved[size - 8][8] = true
}

function placeDataBits(matrix: number[][], reserved: boolean[][], data: Uint8Array, size: number) {
  const bits: number[] = []
  for (const byte of data) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1)
    }
  }

  // Add remainder bits if needed
  const totalModules = size * size
  const reservedCount = reserved.flat().filter(Boolean).length
  const dataModules = totalModules - reservedCount
  while (bits.length < dataModules) bits.push(0)

  let bitIdx = 0
  let right = size - 1

  while (right >= 0) {
    if (right === 6) right-- // Skip timing column
    const left = right - 1

    for (let row = 0; row < size; row++) {
      // Determine if going up or down
      const isUpward = Math.floor((size - 1 - right) / 2) % 2 === 0
      const actualRow = isUpward ? size - 1 - row : row

      for (const col of [right, left]) {
        if (col < 0) continue
        if (!reserved[actualRow][col] && bitIdx < bits.length) {
          matrix[actualRow][col] = bits[bitIdx]
          bitIdx++
        }
      }
    }
    right -= 2
  }
}

function applyMask(matrix: number[][], reserved: boolean[][], maskNum: number): number[][] {
  const size = matrix.length
  const masked = matrix.map((row) => [...row])
  const maskFn = getMaskFunction(maskNum)

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && maskFn(r, c)) {
        masked[r][c] ^= 1
      }
    }
  }
  return masked
}

function getMaskFunction(num: number): (row: number, col: number) => boolean {
  switch (num) {
    case 0: return (r, c) => (r + c) % 2 === 0
    case 1: return (r) => r % 2 === 0
    case 2: return (_r, c) => c % 3 === 0
    case 3: return (r, c) => (r + c) % 3 === 0
    case 4: return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0
    case 5: return (r, c) => ((r * c) % 2 + (r * c) % 3) === 0
    case 6: return (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0
    case 7: return (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0
    default: return () => false
  }
}

function penaltyScore(matrix: number[][]): number {
  const size = matrix.length
  let score = 0

  // Rule 1: consecutive same-color in row/col
  for (let r = 0; r < size; r++) {
    let count = 1
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) {
        count++
        if (count === 5) score += 3
        else if (count > 5) score += 1
      } else {
        count = 1
      }
    }
  }
  for (let c = 0; c < size; c++) {
    let count = 1
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) {
        count++
        if (count === 5) score += 3
        else if (count > 5) score += 1
      } else {
        count = 1
      }
    }
  }

  // Rule 2: 2x2 blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const val = matrix[r][c]
      if (val === matrix[r][c + 1] && val === matrix[r + 1][c] && val === matrix[r + 1][c + 1]) {
        score += 3
      }
    }
  }

  // Rule 4: proportion of dark modules
  const totalModules = size * size
  let darkCount = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) darkCount++
    }
  }
  const percent = (darkCount / totalModules) * 100
  const prev5 = Math.floor(percent / 5) * 5
  const next5 = prev5 + 5
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10

  return score
}

// Format info bits for ECC level M (01) with mask patterns 0-7
const FORMAT_INFO_STRINGS: Record<number, number> = {
  0: 0x5412,
  1: 0x5125,
  2: 0x5e7c,
  3: 0x5b4b,
  4: 0x45f9,
  5: 0x40ce,
  6: 0x4f97,
  7: 0x4aa0,
}

function placeFormatInfo(matrix: number[][], size: number, maskNum: number) {
  const formatBits = FORMAT_INFO_STRINGS[maskNum]

  // Place format info bits
  const bits: number[] = []
  for (let i = 14; i >= 0; i--) {
    bits.push((formatBits >> i) & 1)
  }

  // Around top-left finder - horizontal (left to right along row 8)
  const horizontalPositions = [0, 1, 2, 3, 4, 5, 7, 8] // skip col 6 (timing)
  for (let i = 0; i < 8; i++) {
    matrix[8][horizontalPositions[i]] = bits[i]
  }
  // Around top-left finder - vertical (bottom to top along col 8)
  const verticalPositions = [8, 7, 5, 4, 3, 2, 1, 0] // skip row 6 (timing)
  for (let i = 0; i < 7; i++) {
    matrix[verticalPositions[i]][8] = bits[14 - i]
  }

  // Around top-right finder (right to left along row 8)
  for (let i = 0; i < 8; i++) {
    matrix[8][size - 1 - i] = bits[i]
  }

  // Around bottom-left finder (top to bottom along col 8)
  for (let i = 0; i < 7; i++) {
    matrix[size - 7 + i][8] = bits[8 + i]
  }

  // Dark module
  matrix[size - 8][8] = 1
}

function generateQRMatrix(text: string): number[][] | null {
  if (!text) return null

  const bytes = new TextEncoder().encode(text)
  const versionInfo = selectVersion(bytes.length)
  const { size, version } = versionInfo

  // Check capacity
  const cciBits = version <= 9 ? 8 : 16
  const maxDataBits = versionInfo.dataCapacity * 8
  const neededBits = 4 + cciBits + bytes.length * 8 + 4
  if (neededBits > maxDataBits) return null

  // Encode data
  const encodedData = encodeData(text, versionInfo)

  // Interleave blocks and add ECC
  const codewords = interleaveBlocks(encodedData, versionInfo)

  // Create matrix and place patterns
  const { matrix, reserved } = createMatrix(size)

  // Finder patterns
  placeFinderPattern(matrix, reserved, 0, 0)
  placeFinderPattern(matrix, reserved, 0, size - 7)
  placeFinderPattern(matrix, reserved, size - 7, 0)
  placeSeparators(matrix, reserved, size)

  // Alignment patterns
  placeAlignmentPatterns(matrix, reserved, version)

  // Timing patterns
  placeTimingPatterns(matrix, reserved, size)

  // Reserve format info area
  reserveFormatInfo(reserved, size)

  // Place data
  placeDataBits(matrix, reserved, codewords, size)

  // Try all masks, pick best
  let bestMask = 0
  let bestScore = Infinity
  for (let m = 0; m < 8; m++) {
    const masked = applyMask(matrix, reserved, m)
    placeFormatInfo(masked, size, m)
    const score = penaltyScore(masked)
    if (score < bestScore) {
      bestScore = score
      bestMask = m
    }
  }

  const finalMatrix = applyMask(matrix, reserved, bestMask)
  placeFormatInfo(finalMatrix, size, bestMask)

  return finalMatrix
}

// ── Component ──────────────────────────────────────────────────────────────

export function QrCodeGenerator() {
  const [input, setInput] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!input.trim()) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = 300
        canvas.height = 300
        ctx.fillStyle = '#fafaf9'
        ctx.fillRect(0, 0, 300, 300)
        ctx.fillStyle = '#a8a29e'
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Enter text to generate QR code', 150, 155)
      }
      setError('')
      return
    }

    const matrix = generateQRMatrix(input)
    if (!matrix) {
      setError('Text is too long for QR encoding (max ~120 characters).')
      return
    }

    setError('')
    const moduleSize = 8
    const quietZone = 4
    const size = matrix.length
    const canvasSize = (size + quietZone * 2) * moduleSize

    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    ctx.fillStyle = '#1c1917' // stone-900
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            (c + quietZone) * moduleSize,
            (r + quietZone) * moduleSize,
            moduleSize,
            moduleSize,
          )
        }
      }
    }
  }, [input])

  useEffect(() => {
    render()
  }, [render])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !input.trim()) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [input])

  const handleCopyImage = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !input.trim()) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Fallback: clipboard image write may not be available everywhere
    }
  }, [input])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or URL to encode as QR code..."
          className="w-full h-28 p-4 text-sm text-stone-700 leading-relaxed resize-none outline-none placeholder:text-stone-400"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
          <span className="text-xs text-stone-400">QR Code</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyImage}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              {copied ? 'Copied!' : 'Copy Image'}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded hover:bg-stone-100"
            >
              Download PNG
            </button>
          </div>
        </div>
        <div className="p-6 flex justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
    </div>
  )
}
