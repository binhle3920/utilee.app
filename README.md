# Utilee

A desktop utility tool aggregator — a Next.js static site bundled into a desktop app via Tauri 2.

## Commands

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Static export to /out
npm run lint         # ESLint
npm run tauri:dev    # Tauri desktop app in dev mode
npm run tauri:build  # Build distributable desktop app
```

## Architecture

Utilee renders entirely client-side. `next.config.ts` sets `output: 'export'` for Tauri compatibility — no API routes, no SSR, no `next/image` optimization.

### Tool System

Tools live in `src/tools/` and conform to `ToolDefinition` from `src/tools/types.ts`. They are registered in `src/tools/registry.ts` (`ALL_TOOLS`).

Each tool has a slug, category, icon, description, and a React component. To add a tool:

1. Create `src/tools/<category>/<tool-name>/index.ts` exporting a `ToolDefinition`
2. Create the React component (client-side only)
3. Register it in `src/tools/registry.ts`

Categories: `text-writing`, `converters`, `generators`, `images`, `data`, `network`

### Routing

| Route | View |
|---|---|
| `/` | Dashboard — tool grid with search, grouped by category |
| `/category/[category]` | All tools within a category |
| `/tools/[slug]` | Individual tool, rendered inside a shell with breadcrumb nav |

### Styling

Tailwind CSS v4. Stone-based neutral palette defined as CSS vars in `globals.css`. No component library — all UI is custom Tailwind.

## Tools

**Text & Writing**
| Tool | Description |
|---|---|
| Lorem Ipsum Generator | Generate placeholder Latin text in paragraphs, sentences, or words |
| Word & Character Counter | Count words, characters, sentences, and paragraphs with reading time estimates |
| Case Converter | Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more |
| Markdown Preview | Write Markdown on the left and see a live rendered preview on the right |
| Text Diff | Compare two texts side by side and highlight the differences between them |
| Slug Generator | Generate URL-friendly slugs from any text with customizable options |

**Converters**
| Tool | Description |
|---|---|
| Base64 Encode/Decode | Encode text to Base64 or decode Base64 back to text |
| JSON ↔ YAML | Convert between JSON and YAML formats with no external dependencies |
| CSV ↔ JSON | Convert between CSV and JSON formats. Handles quoted fields and commas |
| Number Base Converter | Convert numbers between binary, octal, decimal, and hexadecimal |
| Unix Timestamp Converter | Convert between Unix timestamps and human-readable dates |
| Color Converter | Convert colors between HEX, RGB, and HSL formats with a live preview |

**Generators**
| Tool | Description |
|---|---|
| UUID Generator | Generate random UUIDs (v4) in bulk with formatting options |
| Password Generator | Generate secure random passwords with customizable length and character sets |
| Hash Generator | Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text input |
| QR Code Generator | Generate QR codes from text or URLs, fully offline |
| Random Data Generator | Generate random names, emails, phone numbers, addresses, and more |

**Data**
| Tool | Description |
|---|---|
| JSON Formatter | Format, minify, and validate JSON with statistics |
| Regex Tester | Test regular expressions with match highlighting and group capture |
| JWT Decoder | Decode and inspect JSON Web Tokens with claim analysis |
| Cron Expression Parser | Parse cron expressions into human-readable schedules with next execution times |
| SQL Formatter | Format and beautify SQL queries with keyword highlighting |

**Network**
| Tool | Description |
|---|---|
| IP Address Info | Display your public IP address, location, and network details |
| Vietnam Gold Price | Live gold prices from SJC, DOJI, and PNJ — Vietnam's major gold dealers |
| URL Encoder/Decoder | Encode or decode URLs and URI components with real-time conversion |
| URL Parser | Parse URLs into their components and extract query parameters |
| HTTP Status Codes | Searchable reference of all standard HTTP status codes with descriptions |
| User Agent Parser | Parse user agent strings to identify browser, OS, device, and engine |

## Raycast Extension

The `raycast-extension/` directory contains a Raycast extension for quick access to Utilee tools. It provides a "Search Tools" command that lists all tools and opens them via deep link (`utilee://tools/[slug]`).

```bash
cd raycast-extension
npm install
npm run dev    # Develop with Raycast
npm run build  # Build extension
npm run lint   # Lint
```

> **Note:** The Raycast extension has its own hardcoded tool list in `src/search-tools.tsx` that must be updated manually when tools are added or removed.
