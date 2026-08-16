import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathPreview({
  tex,
  display = true,
}: {
  tex: string
  display?: boolean
}) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: 'ignore',
  })
  return (
    <div
      className={display ? 'math-preview math-preview-display' : 'math-preview'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
