'use client'

import { useState, useMemo } from 'react'

interface StatusCode {
  code: number
  name: string
  description: string
  detail: string
}

interface StatusGroup {
  label: string
  range: string
  badgeClass: string
  codes: StatusCode[]
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers.', detail: 'The client should continue with the request body. This interim response indicates that everything so far is OK and the client should continue with the request, or ignore the response if the request is already finished.' },
  { code: 101, name: 'Switching Protocols', description: 'The server is switching protocols as requested.', detail: 'The server understands and is willing to comply with the client\'s request to switch protocols. This is typically used when upgrading from HTTP/1.1 to WebSocket.' },
  // 2xx Success
  { code: 200, name: 'OK', description: 'The request has succeeded.', detail: 'The meaning of the success depends on the HTTP method: GET returns the resource, POST returns the result of the action, PUT/DELETE confirms the operation.' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and a new resource has been created.', detail: 'Typically sent after POST or PUT requests. The response body usually contains the created resource, and the Location header contains the URL of the newly created resource.' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but processing is not complete.', detail: 'The request might or might not be eventually acted upon, and may be disallowed when processing occurs. This is useful for asynchronous operations.' },
  { code: 204, name: 'No Content', description: 'The server has fulfilled the request but there is no content to return.', detail: 'Commonly used for DELETE requests or PUT requests where the response body is not needed. The server may return updated metadata in headers.' },
  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', description: 'The resource has been permanently moved to a new URL.', detail: 'All future requests should use the new URL. Search engines will update their links. The method may change from POST to GET in some clients.' },
  { code: 302, name: 'Found', description: 'The resource has been temporarily moved to a different URL.', detail: 'The client should continue to use the original URL for future requests. Historically, some clients changed the method to GET; use 307 to preserve the method.' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the last request.', detail: 'Used for caching. The client can use the cached version. The response must not contain a body, but may update cache headers like ETag or Last-Modified.' },
  { code: 307, name: 'Temporary Redirect', description: 'The resource is temporarily at a different URL, method preserved.', detail: 'Similar to 302, but guarantees that the HTTP method and body will not be changed when the redirect is followed. The client must use the same method for the redirected request.' },
  { code: 308, name: 'Permanent Redirect', description: 'The resource has permanently moved, method preserved.', detail: 'Similar to 301, but guarantees that the HTTP method and body will not be changed. The client must use the same method for the redirected request.' },
  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to client error.', detail: 'The request could not be understood by the server due to malformed syntax, invalid request message framing, or deceptive request routing. The client should not repeat the request without modifications.' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or not been provided.', detail: 'The request requires user authentication. The response must include a WWW-Authenticate header field. The client may repeat the request with appropriate Authorization credentials.' },
  { code: 403, name: 'Forbidden', description: 'The server understood the request but refuses to authorize it.', detail: 'Unlike 401, re-authenticating will not help. The server understood the request but the client does not have permission to access the resource. This could be due to IP restrictions, account status, etc.' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found.', detail: 'The server cannot find the requested resource. This may be temporary or permanent. In an API, this can also mean the endpoint is valid but the specific resource does not exist.' },
  { code: 405, name: 'Method Not Allowed', description: 'The HTTP method is not allowed for the requested resource.', detail: 'The response must include an Allow header listing the valid methods. For example, trying POST on a read-only resource would return 405 with Allow: GET, HEAD.' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', detail: 'The client did not produce a request within the time the server was prepared to wait. The client may repeat the request at any time.' },
  { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the resource.', detail: 'Typically used in PUT requests when there is a version conflict, or in POST requests when the resource already exists. The response body should contain enough information for the user to resolve the conflict.' },
  { code: 410, name: 'Gone', description: 'The resource is no longer available and will not return.', detail: 'Similar to 404, but indicates the resource previously existed and has been intentionally removed. Unlike 404, this condition is expected to be permanent. Search engines will remove the URL from their index.' },
  { code: 413, name: 'Payload Too Large', description: 'The request payload exceeds the server limit.', detail: 'The server is refusing to process a request because the request payload is larger than the server is willing to process. The server may close the connection or return a Retry-After header.' },
  { code: 415, name: 'Unsupported Media Type', description: 'The media type of the request is not supported.', detail: 'The server is refusing the request because the payload format is not supported. For example, sending XML to an endpoint that only accepts JSON.' },
  { code: 418, name: "I'm a Teapot", description: 'The server refuses to brew coffee because it is a teapot.', detail: 'This status code is defined in RFC 2324 (Hyper Text Coffee Pot Control Protocol). It was an April Fools\' joke, but has become a well-known Easter egg in HTTP. Any attempt to brew coffee with a teapot should result in this error.' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request is well-formed but contains semantic errors.', detail: 'The server understands the content type and syntax of the request, but the contained instructions are invalid. Common in APIs when validation fails on the request body.' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given time period.', detail: 'Rate limiting response. The response should include a Retry-After header indicating how long to wait before making new requests. Used to protect servers from being overwhelmed.' },
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'The server encountered an unexpected condition.', detail: 'A generic error message when the server encounters an unexpected condition that prevented it from fulfilling the request. This is a catch-all for server-side errors.' },
  { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required.', detail: 'The server does not recognize the request method or lacks the ability to fulfill the request. Usually implies future availability (e.g., a planned feature).' },
  { code: 502, name: 'Bad Gateway', description: 'The server received an invalid response from an upstream server.', detail: 'The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.' },
  { code: 503, name: 'Service Unavailable', description: 'The server is temporarily unable to handle the request.', detail: 'The server is currently unable to handle the request due to maintenance or overloading. This is usually a temporary condition. The server should send a Retry-After header if possible.' },
  { code: 504, name: 'Gateway Timeout', description: 'The server did not receive a timely response from an upstream server.', detail: 'The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server. Similar to 408, but the timeout occurs between servers, not between client and server.' },
]

function getGroup(code: number): { label: string; range: string; badgeClass: string } {
  if (code < 200) return { label: 'Informational', range: '1xx', badgeClass: 'bg-blue-100 text-blue-700' }
  if (code < 300) return { label: 'Success', range: '2xx', badgeClass: 'bg-green-100 text-green-700' }
  if (code < 400) return { label: 'Redirection', range: '3xx', badgeClass: 'bg-yellow-100 text-yellow-700' }
  if (code < 500) return { label: 'Client Error', range: '4xx', badgeClass: 'bg-red-100 text-red-700' }
  return { label: 'Server Error', range: '5xx', badgeClass: 'bg-purple-100 text-purple-700' }
}

export function HttpStatus() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return STATUS_CODES
    return STATUS_CODES.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    )
  }, [search])

  const groups = useMemo<StatusGroup[]>(() => {
    const map = new Map<string, StatusGroup>()
    for (const code of filtered) {
      const g = getGroup(code.code)
      if (!map.has(g.range)) {
        map.set(g.range, { label: g.label, range: g.range, badgeClass: g.badgeClass, codes: [] })
      }
      map.get(g.range)!.codes.push(code)
    }
    return Array.from(map.values())
  }, [filtered])

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Search */}
      <div className="bg-white border border-stone-200 rounded-xl p-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code number or name..."
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
        />
        <div className="mt-2 flex justify-end">
          <span className="text-xs text-stone-400">
            {filtered.length} of {STATUS_CODES.length} codes
          </span>
        </div>
      </div>

      {/* Status Code Groups */}
      {groups.map((group) => (
        <div key={group.range} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-100 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${group.badgeClass}`}>
              {group.range}
            </span>
            <span className="text-sm font-medium text-stone-700">{group.label}</span>
          </div>

          <div className="flex flex-col divide-y divide-stone-50">
            {group.codes.map((s) => (
              <div key={s.code}>
                <button
                  onClick={() => setExpanded(expanded === s.code ? null : s.code)}
                  className="w-full text-left px-5 py-3 flex items-start gap-3 hover:bg-stone-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-stone-800 font-mono w-10 shrink-0">
                    {s.code}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-stone-700">{s.name}</span>
                    <span className="text-xs text-stone-500">{s.description}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-stone-400 transition-transform ml-auto ${
                      expanded === s.code ? 'rotate-180' : ''
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expanded === s.code && (
                  <div className="px-5 pb-4 pt-0 pl-18">
                    <div className="ml-[52px] p-3 bg-stone-50 rounded-lg text-sm text-stone-600 leading-relaxed">
                      {s.detail}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-10 flex items-center justify-center">
          <span className="text-sm text-stone-400">No status codes match your search.</span>
        </div>
      )}
    </div>
  )
}
