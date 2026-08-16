import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: false,
})

export function renderMarkdown(source: string) {
  return marked.parse(source, { async: false }) as string
}
