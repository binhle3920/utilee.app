export type Locale = 'en' | 'vi'

export interface ToolTranslations {
  // Tool names and descriptions (keyed by slug)
  tools: Record<string, { name: string; description: string }>

  // Common UI strings shared across tools
  common: {
    copy: string
    copied: string
    copyAll: string
    copyToClipboard: string
    generate: string
    regenerate: string
    format: string
    minify: string
    validate: string
    compare: string
    refresh: string
    refreshAll: string
    retry: string
    close: string
    input: string
    output: string
    outputWillAppearHere: string
    mode: string
    method: string
    count: string
    length: string
    type: string
    name: string
    version: string
    encode: string
    decode: string
    preview: string
    description: string
    characters: string
    sec: string
    min: string
    loading: string
    error: string
    buy: string
    sell: string
    unknown: string
  }

  // Per-tool UI strings
  loremIpsum: {
    outputType: string
    paragraphs: string
    sentences: string
    words: string
    startWithLorem: string
  }
  wordCounter: {
    words: string
    characters: string
    sentences: string
    paragraphs: string
    charactersNoSpaces: string
    lines: string
    readingTime: string
    speakingTime: string
    placeholder: string
  }
  caseConverter: {
    placeholder: string
    convertTo: string
  }
  markdownPreview: {
    markdown: string
    preview: string
    placeholder: string
  }
  textDiff: {
    original: string
    modified: string
    originalPlaceholder: string
    modifiedPlaceholder: string
    diffResult: string
    added: string
    removed: string
    unchanged: string
  }
  slugGenerator: {
    inputText: string
    placeholder: string
    separator: string
    hyphen: string
    underscore: string
    forceLowercase: string
    maxLength: string
    unlimited: string
    generatedSlug: string
    character: string
    characters: string
  }
  base64: {
    encodePlaceholder: string
    decodePlaceholder: string
    invalidBase64: string
    couldNotEncode: string
  }
  jsonYaml: {
    conversionError: string
    pasteJson: string
    pasteYaml: string
  }
  csvJson: {
    conversionError: string
    pasteCsv: string
    pasteJsonArray: string
  }
  numberBase: {
    inputBase: string
    binary: string
    octal: string
    decimal: string
    hexadecimal: string
    enterNumber: (base: string) => string
    invalidChar: (base: string) => string
  }
  unixTimestamp: {
    currentTimestamp: string
    unit: string
    seconds: string
    milliseconds: string
    timestampToDate: string
    dateToTimestamp: string
    enterTimestampMs: string
    enterTimestampSec: string
    invalidTimestamp: string
    utc: string
    local: string
    relative: string
    useCurrentTime: string
  }
  colorConverter: {
    preview: string
  }
  uuid: {
    uppercase: string
    generated: (count: number) => string
  }
  password: {
    generatedPassword: string
    uppercaseAZ: string
    lowercaseAz: string
    digits09: string
    symbols: string
    excludeAmbiguous: string
    weak: string
    fair: string
    strong: string
    veryStrong: string
  }
  hash: {
    placeholder: string
    computing: string
    emptyState: string
    md5Note: string
  }
  qrCode: {
    placeholder: string
    tooLong: string
    emptyState: string
    qrCode: string
    copyImage: string
    downloadPng: string
  }
  randomData: {
    dataType: string
    names: string
    emails: string
    phoneNumbers: string
    addresses: string
    dates: string
    numbers: string
    results: (count: number) => string
  }
  jsonFormatter: {
    placeholder: string
    validJson: string
    validJsonMinified: string
    invalidJson: string
    keys: string
    depth: string
    size: string
  }
  regex: {
    pattern: string
    patternPlaceholder: string
    flags: string
    global: string
    caseInsensitive: string
    multiline: string
    dotAll: string
    testPlaceholder: string
    matchesHighlighted: string
    matchResults: string
    matches: (count: number) => string
    matchAt: (index: number, pos: number) => string
    group: (n: number) => string
  }
  jwt: {
    placeholder: string
    invalidJwt: string
    failedDecode: string
    tokenExpired: (date: string) => string
    tokenValid: (date: string) => string
    header: string
    payload: string
    signature: string
    standardClaims: string
    issuer: string
    subject: string
    audience: string
    expirationTime: string
    notBefore: string
    issuedAt: string
    jwtId: string
  }
  cron: {
    cronExpression: string
    everyMinute: string
    hourly: string
    dailyAtMidnight: string
    weeklyMonday: string
    monthly: string
    expectedFields: string
    fieldBreakdown: string
    next5: string
    minuteField: string
    hourField: string
    domField: string
    monthField: string
    dowField: string
  }
  sql: {
    placeholder: string
    formattedSql: string
  }
  ipInfo: {
    fetching: string
    errorMsg: string
    yourIp: string
    city: string
    region: string
    country: string
    postalCode: string
    coordinates: string
    timezone: string
    organization: string
    approximateLocation: string
  }
  urlEncoder: {
    encodePlaceholder: string
    decodePlaceholder: string
    invalidEncoded: string
    couldNotEncode: string
    componentDesc: string
    uriDesc: string
    encodedChars: (count: number, pct: string) => string
  }
  urlParser: {
    url: string
    placeholder: string
    invalidUrl: string
    protocol: string
    origin: string
    host: string
    hostname: string
    port: string
    pathname: string
    search: string
    hash: string
    defaultVal: string
    none: string
    queryParams: (count: number) => string
    key: string
    value: string
    emptyState: string
  }
  httpStatus: {
    searchPlaceholder: string
    codesCount: (filtered: number, total: number) => string
    informational: string
    success: string
    redirection: string
    clientError: string
    serverError: string
    noMatch: string
  }
  userAgent: {
    uaString: string
    resetToCurrent: string
    placeholder: string
    showingCurrent: string
    browser: string
    os: string
    engine: string
    device: string
    renderingEngine: string
    rawString: string
    mobile: string
    tablet: string
    desktop: string
  }
  goldPrice: {
    fetching: string
    errorMsg: string
    last30Days: string
    loadingChart: string
    noHistoryData: string
    goldPrices: string
    other: string
    world: string
    unitNote: string
  }
}

export interface Translations {
  // Dashboard
  searchPlaceholder: string
  resultsFor: (count: number, query: string) => string
  noToolsFound: string

  // Categories
  categories: {
    'text-writing': string
    converters: string
    generators: string
    images: string
    data: string
    network: string
  }

  // Navigation
  dashboard: string

  // Favorites
  addToFavorites: string
  removeFromFavorites: string

  // Settings
  settings: string
  language: string
  selectLanguage: string
  close: string

  // Tool translations
  tool: ToolTranslations
}

export const translations: Record<Locale, Translations> = {
  en: {
    searchPlaceholder: 'Search tools...',
    resultsFor: (count, query) =>
      `${count} result${count !== 1 ? 's' : ''} for \u201c${query}\u201d`,
    noToolsFound: 'No tools found',

    categories: {
      'text-writing': 'Text & Writing',
      converters: 'Converters',
      generators: 'Generators',
      images: 'Images',
      data: 'Data',
      network: 'Network',
    },

    dashboard: 'Dashboard',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    settings: 'Settings',
    language: 'Language',
    selectLanguage: 'Select language',
    close: 'Close',

    tool: {
      tools: {
        'lorem-ipsum': { name: 'Lorem Ipsum Generator', description: 'Generate placeholder Latin text in paragraphs, sentences, or words.' },
        'word-counter': { name: 'Word & Character Counter', description: 'Count words, characters, sentences, and paragraphs with reading time estimates.' },
        'case-converter': { name: 'Case Converter', description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.' },
        'markdown-preview': { name: 'Markdown Preview', description: 'Write Markdown on the left and see a live rendered preview on the right.' },
        'text-diff': { name: 'Text Diff', description: 'Compare two texts side by side and highlight the differences between them.' },
        'slug-generator': { name: 'Slug Generator', description: 'Generate URL-friendly slugs from any text with customizable options.' },
        'base64': { name: 'Base64 Encode/Decode', description: 'Encode text to Base64 or decode Base64 back to text.' },
        'json-yaml': { name: 'JSON \u2194 YAML', description: 'Convert between JSON and YAML formats with no external dependencies.' },
        'csv-json': { name: 'CSV \u2194 JSON', description: 'Convert between CSV and JSON formats. Handles quoted fields and commas.' },
        'number-base': { name: 'Number Base Converter', description: 'Convert numbers between binary, octal, decimal, and hexadecimal.' },
        'unix-timestamp': { name: 'Unix Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates.' },
        'color-converter': { name: 'Color Converter', description: 'Convert colors between HEX, RGB, and HSL formats with a live preview.' },
        'uuid-generator': { name: 'UUID Generator', description: 'Generate random UUIDs (v4) in bulk with formatting options.' },
        'password-generator': { name: 'Password Generator', description: 'Generate secure random passwords with customizable length and character sets.' },
        'hash-generator': { name: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text input.' },
        'qr-code': { name: 'QR Code Generator', description: 'Generate QR codes from text or URLs, fully offline.' },
        'random-data': { name: 'Random Data Generator', description: 'Generate random names, emails, phone numbers, addresses, and more.' },
        'json-formatter': { name: 'JSON Formatter', description: 'Format, minify, and validate JSON with statistics.' },
        'regex-tester': { name: 'Regex Tester', description: 'Test regular expressions with match highlighting and group capture.' },
        'jwt-decoder': { name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens with claim analysis.' },
        'cron-parser': { name: 'Cron Expression Parser', description: 'Parse cron expressions into human-readable schedules with next execution times.' },
        'sql-formatter': { name: 'SQL Formatter', description: 'Format and beautify SQL queries with keyword highlighting.' },
        'ip-info': { name: 'IP Address Info', description: 'Display your public IP address, location, and network details.' },
        'gold-price': { name: 'Vietnam Gold Price', description: "Live gold prices from SJC, DOJI, and PNJ \u2014 Vietnam's major gold dealers." },
        'url-encoder': { name: 'URL Encoder/Decoder', description: 'Encode or decode URLs and URI components with real-time conversion.' },
        'url-parser': { name: 'URL Parser', description: 'Parse URLs into their components and extract query parameters.' },
        'http-status': { name: 'HTTP Status Codes', description: 'Searchable reference of all standard HTTP status codes with descriptions.' },
        'user-agent': { name: 'User Agent Parser', description: 'Parse user agent strings to identify browser, OS, device, and engine.' },
      },

      common: {
        copy: 'Copy',
        copied: 'Copied!',
        copyAll: 'Copy All',
        copyToClipboard: 'Copy to clipboard',
        generate: 'Generate',
        regenerate: 'Regenerate',
        format: 'Format',
        minify: 'Minify',
        validate: 'Validate',
        compare: 'Compare',
        refresh: 'Refresh',
        refreshAll: 'Refresh All',
        retry: 'Retry',
        close: 'Close',
        input: 'Input',
        output: 'Output',
        outputWillAppearHere: 'Output will appear here...',
        mode: 'Mode:',
        method: 'Method',
        count: 'Count:',
        length: 'Length:',
        type: 'Type',
        name: 'Name',
        version: 'Version',
        encode: 'Encode',
        decode: 'Decode',
        preview: 'Preview',
        description: 'Description',
        characters: 'characters',
        sec: 'sec',
        min: 'min',
        loading: 'Loading...',
        error: 'Error',
        buy: 'Buy',
        sell: 'Sell',
        unknown: 'Unknown',
      },

      loremIpsum: {
        outputType: 'Output Type',
        paragraphs: 'Paragraphs',
        sentences: 'Sentences',
        words: 'Words',
        startWithLorem: 'Start with \u201cLorem ipsum\u2026\u201d',
      },
      wordCounter: {
        words: 'Words',
        characters: 'Characters',
        sentences: 'Sentences',
        paragraphs: 'Paragraphs',
        charactersNoSpaces: 'Characters (no spaces)',
        lines: 'Lines',
        readingTime: 'Reading time',
        speakingTime: 'Speaking time',
        placeholder: 'Type or paste your text here...',
      },
      caseConverter: {
        placeholder: 'Type or paste your text here...',
        convertTo: 'Convert to',
      },
      markdownPreview: {
        markdown: 'Markdown',
        preview: 'Preview',
        placeholder: 'Type your Markdown here...',
      },
      textDiff: {
        original: 'Original',
        modified: 'Modified',
        originalPlaceholder: 'Paste the original text here...',
        modifiedPlaceholder: 'Paste the modified text here...',
        diffResult: 'Diff Result',
        added: 'added',
        removed: 'removed',
        unchanged: 'unchanged',
      },
      slugGenerator: {
        inputText: 'Input Text',
        placeholder: 'Type or paste your text here...',
        separator: 'Separator',
        hyphen: 'Hyphen (-)',
        underscore: 'Underscore (_)',
        forceLowercase: 'Force lowercase',
        maxLength: 'Max Length',
        unlimited: 'Unlimited',
        generatedSlug: 'Generated Slug',
        character: 'character',
        characters: 'characters',
      },
      base64: {
        encodePlaceholder: 'Enter text to encode...',
        decodePlaceholder: 'Enter Base64 to decode...',
        invalidBase64: 'Invalid Base64 input.',
        couldNotEncode: 'Could not encode input.',
      },
      jsonYaml: {
        conversionError: 'Conversion error.',
        pasteJson: 'Paste JSON here...',
        pasteYaml: 'Paste YAML here...',
      },
      csvJson: {
        conversionError: 'Conversion error.',
        pasteCsv: 'Paste CSV here...',
        pasteJsonArray: 'Paste JSON array here...',
      },
      numberBase: {
        inputBase: 'Input base:',
        binary: 'Binary',
        octal: 'Octal',
        decimal: 'Decimal',
        hexadecimal: 'Hexadecimal',
        enterNumber: (base) => `Enter a ${base} number...`,
        invalidChar: (base) => `Invalid character for ${base}.`,
      },
      unixTimestamp: {
        currentTimestamp: 'Current Unix Timestamp',
        unit: 'Unit:',
        seconds: 'Seconds',
        milliseconds: 'Milliseconds',
        timestampToDate: 'Timestamp \u2192 Date',
        dateToTimestamp: 'Date \u2192 Timestamp',
        enterTimestampMs: 'Enter timestamp in milliseconds...',
        enterTimestampSec: 'Enter timestamp in seconds...',
        invalidTimestamp: 'Invalid timestamp.',
        utc: 'UTC',
        local: 'Local',
        relative: 'Relative',
        useCurrentTime: 'Use current time',
      },
      colorConverter: {
        preview: 'Preview',
      },
      uuid: {
        uppercase: 'Uppercase',
        generated: (count) => `${count} UUID${count > 1 ? 's' : ''} generated`,
      },
      password: {
        generatedPassword: 'Generated Password',
        uppercaseAZ: 'Uppercase (A-Z)',
        lowercaseAz: 'Lowercase (a-z)',
        digits09: 'Digits (0-9)',
        symbols: 'Symbols (!@#$...)',
        excludeAmbiguous: 'Exclude ambiguous (I, l, 1, O, 0, o)',
        weak: 'weak',
        fair: 'fair',
        strong: 'strong',
        veryStrong: 'very strong',
      },
      hash: {
        placeholder: 'Type or paste text to hash...',
        computing: 'Computing...',
        emptyState: 'Enter text above to generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes in real-time.',
        md5Note: 'MD5 is not available via the Web Crypto API.',
      },
      qrCode: {
        placeholder: 'Enter text or URL to encode as QR code...',
        tooLong: 'Text is too long for QR encoding (max ~120 characters).',
        emptyState: 'Enter text to generate QR code',
        qrCode: 'QR Code',
        copyImage: 'Copy Image',
        downloadPng: 'Download PNG',
      },
      randomData: {
        dataType: 'Data Type',
        names: 'Names',
        emails: 'Emails',
        phoneNumbers: 'Phone Numbers',
        addresses: 'Addresses',
        dates: 'Dates',
        numbers: 'Numbers',
        results: (count) => `${count} result${count > 1 ? 's' : ''}`,
      },
      jsonFormatter: {
        placeholder: 'Paste your JSON here...',
        validJson: 'Valid JSON',
        validJsonMinified: 'Valid JSON (minified)',
        invalidJson: 'Invalid JSON',
        keys: 'Keys',
        depth: 'Depth',
        size: 'Size',
      },
      regex: {
        pattern: 'Pattern',
        patternPlaceholder: 'Enter regex pattern...',
        flags: 'Flags',
        global: 'global',
        caseInsensitive: 'case-insensitive',
        multiline: 'multiline',
        dotAll: 'dotAll',
        testPlaceholder: 'Enter test string...',
        matchesHighlighted: 'Matches Highlighted',
        matchResults: 'Match Results',
        matches: (count) => `${count} match${count !== 1 ? 'es' : ''}`,
        matchAt: (index, pos) => `Match ${index} at index ${pos}`,
        group: (n) => `Group ${n}:`,
      },
      jwt: {
        placeholder: 'Paste your JWT token here...',
        invalidJwt: 'Invalid JWT: expected 3 parts separated by dots',
        failedDecode: 'Failed to decode token',
        tokenExpired: (date) => `Token expired on ${date}`,
        tokenValid: (date) => `Token valid until ${date}`,
        header: 'Header',
        payload: 'Payload',
        signature: 'Signature',
        standardClaims: 'Standard Claims',
        issuer: 'Issuer',
        subject: 'Subject',
        audience: 'Audience',
        expirationTime: 'Expiration Time',
        notBefore: 'Not Before',
        issuedAt: 'Issued At',
        jwtId: 'JWT ID',
      },
      cron: {
        cronExpression: 'Cron Expression',
        everyMinute: 'Every minute',
        hourly: 'Hourly',
        dailyAtMidnight: 'Daily at midnight',
        weeklyMonday: 'Weekly (Monday)',
        monthly: 'Monthly',
        expectedFields: 'Expected 5 fields: minute hour day-of-month month day-of-week',
        fieldBreakdown: 'Field Breakdown',
        next5: 'Next 5 Executions',
        minuteField: 'Minute (0-59)',
        hourField: 'Hour (0-23)',
        domField: 'Day of Month (1-31)',
        monthField: 'Month (1-12)',
        dowField: 'Day of Week (0-6)',
      },
      sql: {
        placeholder: 'Paste your SQL query here...',
        formattedSql: 'Formatted SQL',
      },
      ipInfo: {
        fetching: 'Fetching your IP info...',
        errorMsg: 'Could not retrieve IP information. Check your internet connection.',
        yourIp: 'Your IP Address',
        city: 'City',
        region: 'Region',
        country: 'Country',
        postalCode: 'Postal Code',
        coordinates: 'Coordinates',
        timezone: 'Timezone',
        organization: 'Organization',
        approximateLocation: 'Approximate Location',
      },
      urlEncoder: {
        encodePlaceholder: 'Enter text to encode...',
        decodePlaceholder: 'Enter encoded text to decode...',
        invalidEncoded: 'Invalid encoded string. Check your input.',
        couldNotEncode: 'Could not encode the input.',
        componentDesc: 'encodeURIComponent encodes all special characters including : / ? # & = etc.',
        uriDesc: 'encodeURI preserves URL-valid characters like : / ? # & = and only encodes others.',
        encodedChars: (count, pct) => `${count} encoded characters (${pct}% of output)`,
      },
      urlParser: {
        url: 'URL',
        placeholder: 'https://example.com/path?query=value#hash',
        invalidUrl: 'Invalid URL. Make sure it includes a protocol (e.g. https://).',
        protocol: 'Protocol',
        origin: 'Origin',
        host: 'Host',
        hostname: 'Hostname',
        port: 'Port',
        pathname: 'Pathname',
        search: 'Search',
        hash: 'Hash',
        defaultVal: '(default)',
        none: '(none)',
        queryParams: (count) => `Query Parameters (${count})`,
        key: 'Key',
        value: 'Value',
        emptyState: 'Enter a URL above to parse it into its components.',
      },
      httpStatus: {
        searchPlaceholder: 'Search by code number or name...',
        codesCount: (filtered, total) => `${filtered} of ${total} codes`,
        informational: 'Informational',
        success: 'Success',
        redirection: 'Redirection',
        clientError: 'Client Error',
        serverError: 'Server Error',
        noMatch: 'No status codes match your search.',
      },
      userAgent: {
        uaString: 'User Agent String',
        resetToCurrent: 'Reset to current browser',
        placeholder: 'Paste a user agent string here...',
        showingCurrent: "Showing your current browser's user agent.",
        browser: 'Browser',
        os: 'Operating System',
        engine: 'Engine',
        device: 'Device',
        renderingEngine: 'Rendering Engine',
        rawString: 'Raw String',
        mobile: 'Mobile',
        tablet: 'Tablet',
        desktop: 'Desktop',
      },
      goldPrice: {
        fetching: 'Fetching gold prices...',
        errorMsg: 'Could not retrieve gold prices. Check your internet connection.',
        last30Days: 'Last 30 days',
        loadingChart: 'Loading chart...',
        noHistoryData: 'No historical data available',
        goldPrices: 'Gold Prices',
        other: 'Other',
        world: 'World',
        unitNote: 'Unit: VND/luong (domestic), USD/oz (world)',
      },
    },
  },

  vi: {
    searchPlaceholder: 'Tìm kiếm công cụ...',
    resultsFor: (count, query) =>
      `${count} kết quả cho \u201c${query}\u201d`,
    noToolsFound: 'Không tìm thấy công cụ',

    categories: {
      'text-writing': 'Văn bản & Viết',
      converters: 'Chuyển đổi',
      generators: 'Tạo dữ liệu',
      images: 'Hình ảnh',
      data: 'Dữ liệu',
      network: 'Mạng',
    },

    dashboard: 'Trang chủ',
    addToFavorites: 'Thêm vào yêu thích',
    removeFromFavorites: 'Xoá khỏi yêu thích',
    settings: 'Cài đặt',
    language: 'Ngôn ngữ',
    selectLanguage: 'Chọn ngôn ngữ',
    close: 'Đóng',

    tool: {
      tools: {
        'lorem-ipsum': { name: 'Tạo Lorem Ipsum', description: 'Tạo văn bản giữ chỗ bằng tiếng Latin theo đoạn, câu hoặc từ.' },
        'word-counter': { name: 'Đếm từ & ký tự', description: 'Đếm từ, ký tự, câu và đoạn với ước tính thời gian đọc.' },
        'case-converter': { name: 'Chuyển đổi chữ hoa/thường', description: 'Chuyển đổi giữa CHỮ HOA, chữ thường, Title Case, camelCase, snake_case, v.v.' },
        'markdown-preview': { name: 'Xem trước Markdown', description: 'Viết Markdown bên trái và xem bản xem trước bên phải.' },
        'text-diff': { name: 'So sánh văn bản', description: 'So sánh hai văn bản cạnh nhau và hiển thị sự khác biệt.' },
        'slug-generator': { name: 'Tạo Slug', description: 'Tạo slug thân thiện URL từ văn bản với các tùy chọn.' },
        'base64': { name: 'Mã hóa/Giải mã Base64', description: 'Mã hóa văn bản sang Base64 hoặc giải mã Base64 về văn bản.' },
        'json-yaml': { name: 'JSON \u2194 YAML', description: 'Chuyển đổi giữa JSON và YAML.' },
        'csv-json': { name: 'CSV \u2194 JSON', description: 'Chuyển đổi giữa CSV và JSON. Xử lý trường có dấu ngoặc kép.' },
        'number-base': { name: 'Chuyển đổi cơ số', description: 'Chuyển đổi số giữa nhị phân, bát phân, thập phân và thập lục phân.' },
        'unix-timestamp': { name: 'Chuyển đổi Unix Timestamp', description: 'Chuyển đổi giữa Unix timestamp và ngày giờ.' },
        'color-converter': { name: 'Chuyển đổi màu', description: 'Chuyển đổi màu giữa HEX, RGB và HSL với xem trước.' },
        'uuid-generator': { name: 'Tạo UUID', description: 'Tạo UUID (v4) ngẫu nhiên hàng loạt.' },
        'password-generator': { name: 'Tạo mật khẩu', description: 'Tạo mật khẩu ngẫu nhiên an toàn với độ dài và bộ ký tự tùy chỉnh.' },
        'hash-generator': { name: 'Tạo Hash', description: 'Tạo hash SHA-1, SHA-256, SHA-384 và SHA-512 từ văn bản.' },
        'qr-code': { name: 'Tạo mã QR', description: 'Tạo mã QR từ văn bản hoặc URL, hoàn toàn ngoại tuyến.' },
        'random-data': { name: 'Tạo dữ liệu ngẫu nhiên', description: 'Tạo tên, email, số điện thoại, địa chỉ ngẫu nhiên, v.v.' },
        'json-formatter': { name: 'Định dạng JSON', description: 'Định dạng, thu gọn và xác thực JSON.' },
        'regex-tester': { name: 'Kiểm tra Regex', description: 'Kiểm tra biểu thức chính quy với đánh dấu kết quả.' },
        'jwt-decoder': { name: 'Giải mã JWT', description: 'Giải mã và phân tích JSON Web Token.' },
        'cron-parser': { name: 'Phân tích Cron', description: 'Phân tích biểu thức cron thành lịch trình dễ đọc.' },
        'sql-formatter': { name: 'Định dạng SQL', description: 'Định dạng và làm đẹp câu truy vấn SQL.' },
        'ip-info': { name: 'Thông tin IP', description: 'Hiển thị địa chỉ IP công khai, vị trí và chi tiết mạng.' },
        'gold-price': { name: 'Giá vàng Việt Nam', description: 'Giá vàng trực tiếp từ SJC, DOJI và PNJ.' },
        'url-encoder': { name: 'Mã hóa/Giải mã URL', description: 'Mã hóa hoặc giải mã URL và URI.' },
        'url-parser': { name: 'Phân tích URL', description: 'Phân tích URL thành các thành phần và trích xuất tham số.' },
        'http-status': { name: 'Mã trạng thái HTTP', description: 'Tra cứu tất cả mã trạng thái HTTP tiêu chuẩn.' },
        'user-agent': { name: 'Phân tích User Agent', description: 'Phân tích chuỗi user agent để nhận diện trình duyệt, HĐH, thiết bị.' },
      },

      common: {
        copy: 'Sao chép',
        copied: 'Đã sao chép!',
        copyAll: 'Sao chép tất cả',
        copyToClipboard: 'Sao chép',
        generate: 'Tạo',
        regenerate: 'Tạo lại',
        format: 'Định dạng',
        minify: 'Thu gọn',
        validate: 'Xác thực',
        compare: 'So sánh',
        refresh: 'Làm mới',
        refreshAll: 'Làm mới tất cả',
        retry: 'Thử lại',
        close: 'Đóng',
        input: 'Đầu vào',
        output: 'Đầu ra',
        outputWillAppearHere: 'Kết quả sẽ hiển thị ở đây...',
        mode: 'Chế độ:',
        method: 'Phương thức',
        count: 'Số lượng:',
        length: 'Độ dài:',
        type: 'Loại',
        name: 'Tên',
        version: 'Phiên bản',
        encode: 'Mã hóa',
        decode: 'Giải mã',
        preview: 'Xem trước',
        description: 'Mô tả',
        characters: 'ký tự',
        sec: 'giây',
        min: 'phút',
        loading: 'Đang tải...',
        error: 'Lỗi',
        buy: 'Mua',
        sell: 'Bán',
        unknown: 'Không rõ',
      },

      loremIpsum: {
        outputType: 'Kiểu đầu ra',
        paragraphs: 'Đoạn văn',
        sentences: 'Câu',
        words: 'Từ',
        startWithLorem: 'Bắt đầu bằng \u201cLorem ipsum\u2026\u201d',
      },
      wordCounter: {
        words: 'Từ',
        characters: 'Ký tự',
        sentences: 'Câu',
        paragraphs: 'Đoạn',
        charactersNoSpaces: 'Ký tự (không khoảng trắng)',
        lines: 'Dòng',
        readingTime: 'Thời gian đọc',
        speakingTime: 'Thời gian nói',
        placeholder: 'Nhập hoặc dán văn bản tại đây...',
      },
      caseConverter: {
        placeholder: 'Nhập hoặc dán văn bản tại đây...',
        convertTo: 'Chuyển đổi sang',
      },
      markdownPreview: {
        markdown: 'Markdown',
        preview: 'Xem trước',
        placeholder: 'Nhập Markdown tại đây...',
      },
      textDiff: {
        original: 'Bản gốc',
        modified: 'Bản sửa',
        originalPlaceholder: 'Dán văn bản gốc tại đây...',
        modifiedPlaceholder: 'Dán văn bản đã sửa tại đây...',
        diffResult: 'Kết quả so sánh',
        added: 'thêm',
        removed: 'xóa',
        unchanged: 'không đổi',
      },
      slugGenerator: {
        inputText: 'Văn bản đầu vào',
        placeholder: 'Nhập hoặc dán văn bản tại đây...',
        separator: 'Dấu phân cách',
        hyphen: 'Gạch ngang (-)',
        underscore: 'Gạch dưới (_)',
        forceLowercase: 'Chuyển thành chữ thường',
        maxLength: 'Độ dài tối đa',
        unlimited: 'Không giới hạn',
        generatedSlug: 'Slug đã tạo',
        character: 'ký tự',
        characters: 'ký tự',
      },
      base64: {
        encodePlaceholder: 'Nhập văn bản để mã hóa...',
        decodePlaceholder: 'Nhập Base64 để giải mã...',
        invalidBase64: 'Đầu vào Base64 không hợp lệ.',
        couldNotEncode: 'Không thể mã hóa đầu vào.',
      },
      jsonYaml: {
        conversionError: 'Lỗi chuyển đổi.',
        pasteJson: 'Dán JSON tại đây...',
        pasteYaml: 'Dán YAML tại đây...',
      },
      csvJson: {
        conversionError: 'Lỗi chuyển đổi.',
        pasteCsv: 'Dán CSV tại đây...',
        pasteJsonArray: 'Dán mảng JSON tại đây...',
      },
      numberBase: {
        inputBase: 'Cơ số đầu vào:',
        binary: 'Nhị phân',
        octal: 'Bát phân',
        decimal: 'Thập phân',
        hexadecimal: 'Thập lục phân',
        enterNumber: (base) => `Nhập số ${base}...`,
        invalidChar: (base) => `Ký tự không hợp lệ cho ${base}.`,
      },
      unixTimestamp: {
        currentTimestamp: 'Unix Timestamp hiện tại',
        unit: 'Đơn vị:',
        seconds: 'Giây',
        milliseconds: 'Mili giây',
        timestampToDate: 'Timestamp \u2192 Ngày',
        dateToTimestamp: 'Ngày \u2192 Timestamp',
        enterTimestampMs: 'Nhập timestamp (mili giây)...',
        enterTimestampSec: 'Nhập timestamp (giây)...',
        invalidTimestamp: 'Timestamp không hợp lệ.',
        utc: 'UTC',
        local: 'Địa phương',
        relative: 'Tương đối',
        useCurrentTime: 'Dùng thời gian hiện tại',
      },
      colorConverter: {
        preview: 'Xem trước',
      },
      uuid: {
        uppercase: 'Chữ hoa',
        generated: (count) => `Đã tạo ${count} UUID`,
      },
      password: {
        generatedPassword: 'Mật khẩu đã tạo',
        uppercaseAZ: 'Chữ hoa (A-Z)',
        lowercaseAz: 'Chữ thường (a-z)',
        digits09: 'Chữ số (0-9)',
        symbols: 'Ký hiệu (!@#$...)',
        excludeAmbiguous: 'Loại trừ ký tự dễ nhầm (I, l, 1, O, 0, o)',
        weak: 'yếu',
        fair: 'trung bình',
        strong: 'mạnh',
        veryStrong: 'rất mạnh',
      },
      hash: {
        placeholder: 'Nhập hoặc dán văn bản để băm...',
        computing: 'Đang tính...',
        emptyState: 'Nhập văn bản ở trên để tạo hash SHA-1, SHA-256, SHA-384 và SHA-512.',
        md5Note: 'MD5 không khả dụng qua Web Crypto API.',
      },
      qrCode: {
        placeholder: 'Nhập văn bản hoặc URL để tạo mã QR...',
        tooLong: 'Văn bản quá dài để mã hóa QR (tối đa ~120 ký tự).',
        emptyState: 'Nhập văn bản để tạo mã QR',
        qrCode: 'Mã QR',
        copyImage: 'Sao chép hình',
        downloadPng: 'Tải PNG',
      },
      randomData: {
        dataType: 'Kiểu dữ liệu',
        names: 'Tên',
        emails: 'Email',
        phoneNumbers: 'Số điện thoại',
        addresses: 'Địa chỉ',
        dates: 'Ngày tháng',
        numbers: 'Số',
        results: (count) => `${count} kết quả`,
      },
      jsonFormatter: {
        placeholder: 'Dán JSON tại đây...',
        validJson: 'JSON hợp lệ',
        validJsonMinified: 'JSON hợp lệ (đã thu gọn)',
        invalidJson: 'JSON không hợp lệ',
        keys: 'Khóa',
        depth: 'Độ sâu',
        size: 'Kích thước',
      },
      regex: {
        pattern: 'Mẫu',
        patternPlaceholder: 'Nhập mẫu regex...',
        flags: 'Cờ',
        global: 'toàn cục',
        caseInsensitive: 'không phân biệt hoa thường',
        multiline: 'nhiều dòng',
        dotAll: 'dotAll',
        testPlaceholder: 'Nhập chuỗi kiểm tra...',
        matchesHighlighted: 'Kết quả đánh dấu',
        matchResults: 'Kết quả tìm kiếm',
        matches: (count) => `${count} kết quả`,
        matchAt: (index, pos) => `Kết quả ${index} tại vị trí ${pos}`,
        group: (n) => `Nhóm ${n}:`,
      },
      jwt: {
        placeholder: 'Dán mã JWT tại đây...',
        invalidJwt: 'JWT không hợp lệ: cần 3 phần ngăn cách bởi dấu chấm',
        failedDecode: 'Không thể giải mã token',
        tokenExpired: (date) => `Token đã hết hạn vào ${date}`,
        tokenValid: (date) => `Token hợp lệ đến ${date}`,
        header: 'Header',
        payload: 'Payload',
        signature: 'Chữ ký',
        standardClaims: 'Các claim tiêu chuẩn',
        issuer: 'Nhà phát hành',
        subject: 'Chủ thể',
        audience: 'Đối tượng',
        expirationTime: 'Thời gian hết hạn',
        notBefore: 'Không trước',
        issuedAt: 'Phát hành lúc',
        jwtId: 'JWT ID',
      },
      cron: {
        cronExpression: 'Biểu thức Cron',
        everyMinute: 'Mỗi phút',
        hourly: 'Mỗi giờ',
        dailyAtMidnight: 'Hàng ngày lúc nửa đêm',
        weeklyMonday: 'Hàng tuần (Thứ 2)',
        monthly: 'Hàng tháng',
        expectedFields: 'Cần 5 trường: phút giờ ngày-trong-tháng tháng ngày-trong-tuần',
        fieldBreakdown: 'Chi tiết các trường',
        next5: '5 lần thực thi tiếp theo',
        minuteField: 'Phút (0-59)',
        hourField: 'Giờ (0-23)',
        domField: 'Ngày trong tháng (1-31)',
        monthField: 'Tháng (1-12)',
        dowField: 'Ngày trong tuần (0-6)',
      },
      sql: {
        placeholder: 'Dán câu truy vấn SQL tại đây...',
        formattedSql: 'SQL đã định dạng',
      },
      ipInfo: {
        fetching: 'Đang lấy thông tin IP...',
        errorMsg: 'Không thể lấy thông tin IP. Kiểm tra kết nối mạng.',
        yourIp: 'Địa chỉ IP của bạn',
        city: 'Thành phố',
        region: 'Vùng',
        country: 'Quốc gia',
        postalCode: 'Mã bưu điện',
        coordinates: 'Tọa độ',
        timezone: 'Múi giờ',
        organization: 'Tổ chức',
        approximateLocation: 'Vị trí ước lượng',
      },
      urlEncoder: {
        encodePlaceholder: 'Nhập văn bản để mã hóa...',
        decodePlaceholder: 'Nhập văn bản đã mã hóa để giải mã...',
        invalidEncoded: 'Chuỗi mã hóa không hợp lệ. Kiểm tra đầu vào.',
        couldNotEncode: 'Không thể mã hóa đầu vào.',
        componentDesc: 'encodeURIComponent mã hóa tất cả ký tự đặc biệt bao gồm : / ? # & = v.v.',
        uriDesc: 'encodeURI giữ nguyên các ký tự URL hợp lệ như : / ? # & = và chỉ mã hóa các ký tự khác.',
        encodedChars: (count, pct) => `${count} ký tự đã mã hóa (${pct}% đầu ra)`,
      },
      urlParser: {
        url: 'URL',
        placeholder: 'https://example.com/path?query=value#hash',
        invalidUrl: 'URL không hợp lệ. Đảm bảo có giao thức (ví dụ: https://).',
        protocol: 'Giao thức',
        origin: 'Origin',
        host: 'Host',
        hostname: 'Hostname',
        port: 'Cổng',
        pathname: 'Đường dẫn',
        search: 'Tìm kiếm',
        hash: 'Hash',
        defaultVal: '(mặc định)',
        none: '(không có)',
        queryParams: (count) => `Tham số truy vấn (${count})`,
        key: 'Khóa',
        value: 'Giá trị',
        emptyState: 'Nhập URL ở trên để phân tích thành các thành phần.',
      },
      httpStatus: {
        searchPlaceholder: 'Tìm theo mã số hoặc tên...',
        codesCount: (filtered, total) => `${filtered} trên ${total} mã`,
        informational: 'Thông tin',
        success: 'Thành công',
        redirection: 'Chuyển hướng',
        clientError: 'Lỗi Client',
        serverError: 'Lỗi Server',
        noMatch: 'Không tìm thấy mã trạng thái phù hợp.',
      },
      userAgent: {
        uaString: 'Chuỗi User Agent',
        resetToCurrent: 'Đặt lại về trình duyệt hiện tại',
        placeholder: 'Dán chuỗi user agent tại đây...',
        showingCurrent: 'Đang hiển thị user agent của trình duyệt hiện tại.',
        browser: 'Trình duyệt',
        os: 'Hệ điều hành',
        engine: 'Engine',
        device: 'Thiết bị',
        renderingEngine: 'Engine hiển thị',
        rawString: 'Chuỗi gốc',
        mobile: 'Di động',
        tablet: 'Máy tính bảng',
        desktop: 'Máy tính',
      },
      goldPrice: {
        fetching: 'Đang lấy giá vàng...',
        errorMsg: 'Không thể lấy giá vàng. Kiểm tra kết nối mạng.',
        last30Days: '30 ngày gần đây',
        loadingChart: 'Đang tải biểu đồ...',
        noHistoryData: 'Không có dữ liệu lịch sử',
        goldPrices: 'Giá vàng',
        other: 'Khác',
        world: 'Thế giới',
        unitNote: 'Đơn vị: VND/lượng (trong nước), USD/oz (thế giới)',
      },
    },
  },
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '\ud83c\uddec\ud83c\udde7',
  vi: '\ud83c\uddfb\ud83c\uddf3',
}
