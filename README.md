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
