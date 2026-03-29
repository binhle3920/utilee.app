import { List, ActionPanel, Action, Icon, open } from "@raycast/api";

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  keywords?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "text-writing": "Text & Writing",
  converters: "Converters",
  generators: "Generators",
  images: "Images",
  data: "Data",
  network: "Network",
};

const CATEGORY_ORDER = ["text-writing", "converters", "generators", "data", "network"];

const TOOLS: Tool[] = [
  // Text & Writing
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder Latin text in paragraphs, sentences, or words.", category: "text-writing", icon: "📝", keywords: ["placeholder", "latin", "dummy", "text", "filler", "copy"] },
  { slug: "word-counter", name: "Word & Character Counter", description: "Count words, characters, sentences, and paragraphs with reading time estimates.", category: "text-writing", icon: "🔢", keywords: ["word", "character", "count", "letter", "sentence", "paragraph", "reading time"] },
  { slug: "case-converter", name: "Case Converter", description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.", category: "text-writing", icon: "🔤", keywords: ["uppercase", "lowercase", "title", "camel", "snake", "case"] },
  { slug: "markdown-preview", name: "Markdown Preview", description: "Write Markdown on the left and see a live rendered preview on the right.", category: "text-writing", icon: "📄", keywords: ["markdown", "preview", "render", "md"] },
  { slug: "text-diff", name: "Text Diff", description: "Compare two texts side by side and highlight the differences between them.", category: "text-writing", icon: "🔀", keywords: ["diff", "compare", "difference", "merge"] },
  { slug: "slug-generator", name: "Slug Generator", description: "Generate URL-friendly slugs from any text with customizable options.", category: "text-writing", icon: "🔗", keywords: ["slug", "url", "friendly", "permalink", "seo"] },

  // Converters
  { slug: "base64", name: "Base64 Encode/Decode", description: "Encode text to Base64 or decode Base64 back to text.", category: "converters", icon: "🔐", keywords: ["base64", "encode", "decode"] },
  { slug: "json-yaml", name: "JSON ↔ YAML", description: "Convert between JSON and YAML formats with no external dependencies.", category: "converters", icon: "🔄", keywords: ["json", "yaml", "convert"] },
  { slug: "csv-json", name: "CSV ↔ JSON", description: "Convert between CSV and JSON formats. Handles quoted fields and commas.", category: "converters", icon: "📊", keywords: ["csv", "json", "convert", "table"] },
  { slug: "number-base", name: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal.", category: "converters", icon: "🔢", keywords: ["decimal", "hex", "octal", "binary", "base"] },
  { slug: "unix-timestamp", name: "Unix Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates.", category: "converters", icon: "⏱️", keywords: ["unix", "timestamp", "epoch", "date", "time"] },
  { slug: "color-converter", name: "Color Converter", description: "Convert colors between HEX, RGB, and HSL formats with a live preview.", category: "converters", icon: "🎨", keywords: ["color", "hex", "rgb", "hsl", "convert"] },

  // Generators
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate random UUIDs (v4) in bulk with formatting options.", category: "generators", icon: "🆔", keywords: ["uuid", "guid", "unique", "id"] },
  { slug: "password-generator", name: "Password Generator", description: "Generate secure random passwords with customizable length and character sets.", category: "generators", icon: "🔑", keywords: ["password", "random", "secure", "generate"] },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text input.", category: "generators", icon: "#️⃣", keywords: ["hash", "md5", "sha", "sha256", "checksum"] },
  { slug: "qr-code", name: "QR Code Generator", description: "Generate QR codes from text or URLs, fully offline.", category: "generators", icon: "📱", keywords: ["qr", "code", "barcode", "scan"] },
  { slug: "random-data", name: "Random Data Generator", description: "Generate random names, emails, phone numbers, addresses, and more.", category: "generators", icon: "🎲", keywords: ["random", "fake", "mock", "data", "name", "email"] },

  // Data
  { slug: "json-formatter", name: "JSON Formatter", description: "Format, minify, and validate JSON with statistics.", category: "data", icon: "{ }", keywords: ["json", "format", "validate", "pretty", "minify"] },
  { slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions with match highlighting and group capture.", category: "data", icon: "🔍", keywords: ["regex", "regular", "expression", "test", "match", "pattern"] },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens with claim analysis.", category: "data", icon: "🎟️", keywords: ["jwt", "token", "decode", "json", "web"] },
  { slug: "cron-parser", name: "Cron Expression Parser", description: "Parse cron expressions into human-readable schedules with next execution times.", category: "data", icon: "⏰", keywords: ["cron", "schedule", "timer", "expression"] },
  { slug: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries with keyword highlighting.", category: "data", icon: "🗃️", keywords: ["sql", "format", "query", "beautify", "database"] },

  // Network
  { slug: "ip-info", name: "IP Address Info", description: "Display your public IP address, location, and network details.", category: "network", icon: "🌐", keywords: ["ip", "address", "location", "geo", "network", "public"] },
  { slug: "gold-price", name: "Vietnam Gold Price", description: "Live gold prices from SJC, DOJI, and PNJ — Vietnam's major gold dealers.", category: "network", icon: "🥇", keywords: ["gold", "price", "sjc", "doji", "pnj", "vietnam", "vang", "gia"] },
  { slug: "url-encoder", name: "URL Encoder/Decoder", description: "Encode or decode URLs and URI components with real-time conversion.", category: "network", icon: "🔗", keywords: ["url", "encode", "decode", "percent", "uri"] },
  { slug: "url-parser", name: "URL Parser", description: "Parse URLs into their components and extract query parameters.", category: "network", icon: "🌐", keywords: ["url", "parse", "query", "string", "path"] },
  { slug: "http-status", name: "HTTP Status Codes", description: "Searchable reference of all standard HTTP status codes with descriptions.", category: "network", icon: "📡", keywords: ["http", "status", "code", "response", "api"] },
  { slug: "user-agent", name: "User Agent Parser", description: "Parse user agent strings to identify browser, OS, device, and engine.", category: "network", icon: "🖥️", keywords: ["user", "agent", "browser", "os", "device", "ua"] },
];

const toolsByCategory: Record<string, Tool[]> = {};
for (const tool of TOOLS) {
  if (!toolsByCategory[tool.category]) toolsByCategory[tool.category] = [];
  toolsByCategory[tool.category].push(tool);
}

export default function SearchTools() {
  return (
    <List searchBarPlaceholder="Search Utilee tools...">
      {CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]).map((category) => (
        <List.Section key={category} title={CATEGORY_LABELS[category] ?? category}>
          {toolsByCategory[category].map((tool) => (
            <List.Item
              key={tool.slug}
              icon={tool.icon}
              title={tool.name}
              subtitle={tool.description}
              keywords={[...(tool.keywords ?? []), tool.category]}
              actions={
                <ActionPanel>
                  <Action
                    title="Open in Utilee"
                    icon={Icon.ArrowRight}
                    onAction={() => open(`utilee://tools/${tool.slug}`)}
                  />
                  <Action.CopyToClipboard
                    title="Copy Deep Link"
                    content={`utilee://tools/${tool.slug}`}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
