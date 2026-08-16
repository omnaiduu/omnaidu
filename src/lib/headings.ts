export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractHeadings(markdown: string) {
  const body = markdown.replace(/^# .+\n+/, '')
  const items: { id: string; title: string }[] = []
  for (const line of body.split('\n')) {
    const match = line.match(/^##\s+(.+)/)
    if (!match) continue
    const title = match[1].replace(/[*_`]/g, '').trim()
    if (!title) continue
    items.push({ id: headingId(title), title })
  }
  return items
}
