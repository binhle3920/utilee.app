# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Next.js dev server (localhost:3000)
pnpm build        # Static export to /out
pnpm lint         # ESLint
pnpm tauri:dev    # Tauri desktop app in dev mode
pnpm tauri:build  # Build distributable desktop app
```

No test runner is configured yet.

## Architecture

Utilee is a desktop utility tool aggregator — a Next.js static site bundled into a desktop app via Tauri 2.

**Key constraint:** `next.config.ts` sets `output: 'export'` and `images.unoptimized: true` for Tauri compatibility. This means no server-side features (no API routes, no SSR, no `next/image` optimization).

### Tool System

All tools live in `src/tools/` and must conform to `ToolDefinition` from `src/tools/types.ts`. Tools are registered in `src/tools/registry.ts` (`ALL_TOOLS` array). Each tool has:
- A slug (used as the URL path under `/tools/[slug]`)
- A category (one of 6: `text-writing`, `converters`, `generators`, `images`, `data`, `network`)
- A React component (rendered client-side on `/tools/[slug]`)
- Optional `keywords` array for search

To add a new tool: create a directory under `src/tools/<category>/<tool-name>/`, export a `toolDef` (ToolDefinition) from `index.ts` and a React component, then register it in `registry.ts`. The Raycast extension (`raycast-extension/src/search-tools.tsx`) has a hardcoded tool list that must be updated separately.

### Routing

- `/` → `DashboardView` (tool grid with search, grouped by category)
- `/category/[category]` → category page showing all tools in that category
- `/tools/[slug]` → static page generated from `ALL_TOOLS` slugs; renders the tool's component inside a shell with `TopBar` breadcrumb nav

`src/lib/tools.ts` contains helper functions (`getAllSlugs`, `getToolBySlug`, `getToolsByCategory`, `searchTools`) that operate on `ALL_TOOLS`.

### Deep Linking

Tauri registers the `utilee://` URL scheme. Deep links like `utilee://tools/[slug]` are received by Rust, emitted as events, and handled by `useDeepLink()` hook in `DeepLinkHandler.tsx` which calls `router.push()`. The Raycast extension uses these deep links to open tools.

### State Management

Client-side only — React hooks with localStorage for favorites (`useFavorites` hook uses `useSyncExternalStore`). No server state.

### Styling

Tailwind CSS v4. Stone-based neutral palette defined as CSS vars in `globals.css`. No component library — all UI is custom Tailwind. Fonts: Geist Sans and Geist Mono via CSS variables.
