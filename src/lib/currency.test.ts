import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'node:test'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'
import { prepareMarkdown } from './currency.ts'

function render(markdown: string) {
  return renderToStaticMarkup(
    createElement(ReactMarkdown, {
      remarkPlugins: [remarkMath, remarkDirective],
      rehypePlugins: [[rehypeKatex, { throwOnError: false, strict: 'ignore' }]],
      children: prepareMarkdown(markdown),
    }),
  )
}

function textOf(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
}

describe('prices and math', () => {
  it('renders $99 and $0.75 as currency', () => {
    const html = render('A sentence containing $99 and $0.75.')
    const text = textOf(html)
    assert.match(text, /\$99/)
    assert.match(text, /\$0\.75/)
    assert.equal(html.includes('katex'), false)
    assert.equal(html.includes('\\'), false)
  })

  it('keeps an escaped price as $99 with no visible backslash', () => {
    const html = render('Gemini charges \\$0.75 per million, about \\$99 a month.')
    const text = textOf(html)
    assert.match(text, /\$0\.75/)
    assert.match(text, /\$99/)
    assert.equal(text.includes('\\'), false)
    assert.equal(html.includes('katex'), false)
    assert.equal(prepareMarkdown('about \\$99 a month'), 'about \\$99 a month')
  })

  it('still renders a real equation with KaTeX', () => {
    const html = render('Energy is $E = mc^2$ in this line.')
    assert.match(html, /katex/)
    assert.match(html, /katex-mathml|katex-html/)
    assert.equal(textOf(html).includes('\\'), false)
  })

  it('does not let a price swallow a later equation', () => {
    const html = render('The plan is $99.\n\nEnergy is $E = mc^2$.')
    const text = textOf(html)
    assert.match(text, /\$99/)
    assert.match(html, /katex/)
    assert.equal(text.includes('\\'), false)
  })

  it('keeps a numeric equation as math', () => {
    const html = render('Check $1 + 1 = 2$ before shipping.')
    assert.match(html, /katex/)
    assert.equal(textOf(html).includes('$1'), false)
  })

  it('leaves dollars inside code untouched', () => {
    const source = '```json\n{ "query": "Pro $99" }\n```\n\nOutside, it is $99 and $0.75.'
    const prepared = prepareMarkdown(source)
    assert.match(prepared, /"Pro \$99"/)
    assert.doesNotMatch(prepared, /"Pro \\\$99"/)
    const html = render(source)
    assert.match(textOf(html), /Pro \$99/)
    assert.match(textOf(html), /\$0\.75/)
    assert.equal(textOf(html).includes('\\'), false)
  })

  it('does not show a backslash in a directive caption', () => {
    const escaped = ':::compare{before="/a.webp" after="/b.webp" beforeCaption="A voice says \\$99."}\n:::'
    const bare = ':::compare{before="/a.webp" after="/b.webp" beforeCaption="A voice says $99. $99 is also printed."}\n:::'
    assert.match(prepareMarkdown(escaped), /beforeCaption="A voice says \$99\."/)
    assert.doesNotMatch(prepareMarkdown(escaped), /\\\$/)
    assert.match(prepareMarkdown(bare), /beforeCaption="A voice says \$99\. \$99 is also printed\."/)
    assert.doesNotMatch(prepareMarkdown(bare), /\\/)
  })

  it('leaves display math alone', () => {
    const source = '$$\nE = mc^2\n$$\n\nStill $99.'
    const prepared = prepareMarkdown(source)
    assert.match(prepared, /\$\$\nE = mc\^2\n\$\$/)
    assert.match(prepared, /\\\$99/)
    const html = render(source)
    assert.match(html, /katex-display/)
    assert.match(textOf(html), /\$99/)
  })
})
