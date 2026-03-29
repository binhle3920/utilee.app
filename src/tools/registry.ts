import { toolDef as loremIpsum } from './text-writing/lorem-ipsum'
import { toolDef as wordCounter } from './text-writing/word-counter'
import { toolDef as caseConverter } from './text-writing/case-converter'
import { toolDef as markdownPreview } from './text-writing/markdown-preview'
import { toolDef as textDiff } from './text-writing/text-diff'
import { toolDef as slugGenerator } from './text-writing/slug-generator'
import { toolDef as ipInfo } from './network/ip-info'
import { toolDef as goldPrice } from './network/gold-price'
import { toolDef as urlEncoder } from './network/url-encoder'
import { toolDef as urlParser } from './network/url-parser'
import { toolDef as httpStatus } from './network/http-status'
import { toolDef as userAgent } from './network/user-agent'
import { toolDef as base64 } from './converters/base64'
import { toolDef as jsonYaml } from './converters/json-yaml'
import { toolDef as csvJson } from './converters/csv-json'
import { toolDef as numberBase } from './converters/number-base'
import { toolDef as unixTimestamp } from './converters/unix-timestamp'
import { toolDef as colorConverter } from './converters/color-converter'
import { toolDef as jsonFormatter } from './data/json-formatter'
import { toolDef as regexTester } from './data/regex-tester'
import { toolDef as jwtDecoder } from './data/jwt-decoder'
import { toolDef as cronParser } from './data/cron-parser'
import { toolDef as sqlFormatter } from './data/sql-formatter'
import { toolDef as uuidGenerator } from './generators/uuid-generator'
import { toolDef as passwordGenerator } from './generators/password-generator'
import { toolDef as hashGenerator } from './generators/hash-generator'
import { toolDef as qrCode } from './generators/qr-code'
import { toolDef as randomData } from './generators/random-data'

import type { ToolDefinition } from './types'

export const ALL_TOOLS: ToolDefinition[] = [
  loremIpsum,
  wordCounter,
  caseConverter,
  markdownPreview,
  textDiff,
  slugGenerator,
  ipInfo,
  goldPrice,
  urlEncoder,
  urlParser,
  httpStatus,
  userAgent,
  base64,
  jsonYaml,
  csvJson,
  numberBase,
  unixTimestamp,
  colorConverter,
  jsonFormatter,
  regexTester,
  jwtDecoder,
  cronParser,
  sqlFormatter,
  uuidGenerator,
  passwordGenerator,
  hashGenerator,
  qrCode,
  randomData,
]
