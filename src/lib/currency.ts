/**
 * remark-math pairs every single `$` with the next one, so a sentence like
 * `$99 and $0.75` becomes one math span. Escape currency amounts before parse.
 * Leave real `$...$` / `$$...$$` equations alone. `\$99` is already escaped and
 * must stay that way so the parser still prints `$99` without a backslash.
 *
 * Directive attributes are not math. Unescape `\$` there (a caption would
 * otherwise show the backslash) and do not add new escapes.
 */

const TEX_MARKER = /\\[a-zA-Z]|[_^{}]/
const CURRENCY_AMOUNT = /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?!\d)/

export function prepareMarkdown(source: string): string {
  let out = ''
  let prose = ''
  let i = 0

  const flush = () => {
    if (!prose) return
    out += protectCurrency(prose)
    prose = ''
  }

  while (i < source.length) {
    if (isLineStart(source, i)) {
      const fence = matchFenceOpen(source, i)
      if (fence) {
        flush()
        const end = fence.close ?? source.length
        out += source.slice(i, end)
        i = end
        continue
      }
      const flow = matchMathFlowOpen(source, i)
      if (flow) {
        flush()
        const end = flow.close ?? source.length
        out += source.slice(i, end)
        i = end
        continue
      }
    }

    const codeEnd = matchInlineCode(source, i)
    if (codeEnd > i) {
      flush()
      out += source.slice(i, codeEnd)
      i = codeEnd
      continue
    }

    const directive = matchDirectiveAttrs(source, i)
    if (directive) {
      flush()
      out += source.slice(i, directive.braceStart)
      out += unescapeAttributeDollars(source.slice(directive.braceStart, directive.braceEnd))
      i = directive.braceEnd
      continue
    }

    prose += source[i]
    i++
  }

  flush()
  return out
}

function protectCurrency(text: string): string {
  let out = ''
  let i = 0

  while (i < text.length) {
    if (text[i] === '\\' && text[i + 1] === '$') {
      out += '\\$'
      i += 2
      continue
    }

    if (text[i] !== '$') {
      out += text[i]
      i++
      continue
    }

    const run = dollarRun(text, i)
    if (run >= 2) {
      const close = findCloser(text, i + run, run)
      if (close === -1) {
        out += text.slice(i, i + run)
        i += run
        continue
      }
      out += text.slice(i, close + run)
      i = close + run
      continue
    }

    const close = findCloser(text, i + 1, 1)
    if (close !== -1 && isMathSpan(text.slice(i + 1, close))) {
      out += text.slice(i, close + 1)
      i = close + 1
      continue
    }

    if (CURRENCY_AMOUNT.test(text.slice(i + 1))) {
      out += '\\$'
      i++
      continue
    }

    out += '$'
    i++
  }

  return out
}

function isMathSpan(inner: string): boolean {
  if (TEX_MARKER.test(inner)) return true
  const trimmed = inner.trim()
  if (!trimmed) return false
  if (/^[\d,.]+$/.test(trimmed)) return true
  if (/\s/.test(trimmed)) {
    const words = trimmed.split(/\s+/)
    if (words.some((word) => /^[A-Za-z][A-Za-z'-]{2,}$/.test(word))) return false
    return /[A-Za-z=+\-*/<>]/.test(trimmed)
  }
  return /[A-Za-z=+\-*/<>()[\]]/.test(trimmed)
}

function dollarRun(text: string, index: number) {
  let count = 0
  while (text[index + count] === '$') count++
  return count
}

function findCloser(text: string, from: number, size: number) {
  let j = from
  while (j < text.length) {
    if (text[j] === '\\') {
      j += text[j + 1] === undefined ? 1 : 2
      continue
    }
    if (text[j] === '$') {
      const run = dollarRun(text, j)
      if (run === size) return j
      j += run
      continue
    }
    j++
  }
  return -1
}

function isLineStart(source: string, index: number) {
  return index === 0 || source[index - 1] === '\n'
}

function lineEnd(source: string, from: number) {
  const nl = source.indexOf('\n', from)
  return nl === -1 ? source.length : nl
}

function matchFenceOpen(source: string, index: number) {
  let j = index
  let indent = 0
  while (source[j] === ' ' && indent < 4) {
    indent++
    j++
  }
  const marker = source[j]
  if ((marker !== '`' && marker !== '~') || indent >= 4) return null
  let len = 0
  while (source[j] === marker) {
    len++
    j++
  }
  if (len < 3) return null
  const end = lineEnd(source, j)
  const info = source.slice(j, end).replace(/\r$/, '')
  if (marker === '`' && info.includes('`')) return null
  const contentStart = end < source.length ? end + 1 : source.length
  const close = findFenceClose(source, contentStart, marker, len)
  return { close: close ?? source.length }
}

function findFenceClose(source: string, from: number, marker: string, len: number) {
  let i = from
  while (i < source.length) {
    const end = lineEnd(source, i)
    const line = source.slice(i, end).replace(/\r$/, '')
    if (isClosingFence(line, marker, len)) return end < source.length ? end + 1 : source.length
    i = end < source.length ? end + 1 : source.length
  }
  return null
}

function isClosingFence(line: string, marker: string, len: number) {
  let i = 0
  let indent = 0
  while (line[i] === ' ' && indent < 4) {
    indent++
    i++
  }
  if (indent >= 4) return false
  let count = 0
  while (line[i] === marker) {
    count++
    i++
  }
  if (count < len) return false
  return line.slice(i).trim() === ''
}

function matchMathFlowOpen(source: string, index: number) {
  let j = index
  let indent = 0
  while (source[j] === ' ' && indent < 4) {
    indent++
    j++
  }
  if (source[j] !== '$' || indent >= 4) return null
  let size = 0
  while (source[j] === '$') {
    size++
    j++
  }
  if (size < 2) return null
  const end = lineEnd(source, j)
  const rest = source.slice(j, end).replace(/\r$/, '')
  if (rest.includes('$')) return null
  const contentStart = end < source.length ? end + 1 : source.length
  const close = findMathFlowClose(source, contentStart, size)
  return { close: close ?? source.length }
}

function findMathFlowClose(source: string, from: number, size: number) {
  let i = from
  while (i < source.length) {
    const end = lineEnd(source, i)
    const line = source.slice(i, end).replace(/\r$/, '')
    if (isClosingMathFence(line, size)) return end < source.length ? end + 1 : source.length
    i = end < source.length ? end + 1 : source.length
  }
  return null
}

function isClosingMathFence(line: string, size: number) {
  let i = 0
  let indent = 0
  while (line[i] === ' ' && indent < 4) {
    indent++
    i++
  }
  if (indent >= 4 || line[i] !== '$') return false
  let count = 0
  while (line[i] === '$') {
    count++
    i++
  }
  return count >= size && line.slice(i).trim() === ''
}

function matchInlineCode(source: string, index: number) {
  if (source[index] !== '`') return -1
  let ticks = 0
  while (source[index + ticks] === '`') ticks++
  let j = index + ticks
  while (j < source.length) {
    if (source[j] !== '`') {
      j++
      continue
    }
    let run = 0
    while (source[j + run] === '`') run++
    if (run === ticks) return j + run
    j += run
  }
  return -1
}

function matchDirectiveAttrs(source: string, index: number) {
  if (source[index] !== ':') return null
  if (index > 0 && source[index - 1] === ':') return null
  let j = index
  let colons = 0
  while (source[j] === ':') {
    colons++
    j++
  }
  if (colons < 1 || colons > 3) return null
  if (!/[A-Za-z]/.test(source[j] ?? '')) return null
  j++
  while (/[A-Za-z0-9-]/.test(source[j] ?? '')) j++
  if (source[j] !== '{') return null
  const braceEnd = endOfAttributeBlock(source, j)
  if (braceEnd === -1) return null
  return { braceStart: j, braceEnd }
}

function endOfAttributeBlock(source: string, start: number) {
  let depth = 0
  let quote = ''
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    if (quote) {
      if (ch === '\\') {
        i++
        continue
      }
      if (ch === quote) quote = ''
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i + 1
    }
  }
  return -1
}

function unescapeAttributeDollars(block: string) {
  let out = ''
  for (let i = 0; i < block.length; i++) {
    if (block[i] === '\\' && block[i + 1] === '\\') {
      out += '\\\\'
      i++
      continue
    }
    if (block[i] === '\\' && block[i + 1] === '$') {
      out += '$'
      i++
      continue
    }
    out += block[i]
  }
  return out
}
