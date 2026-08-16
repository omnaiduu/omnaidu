const SITE_URL = 'https://omnaidu.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/bankbot-turn-loop`

function isAbsolute(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function absoluteUrl(path: string): string {
  if (isAbsolute(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export const seo = ({
  title,
  description,
  image,
  url,
}: {
  title: string
  description?: string
  image?: string
  url?: string
}) => {
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE)
  const ogUrl = url ? absoluteUrl(url) : undefined

  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { property: 'og:image', content: ogImage },
    ...(ogUrl
      ? [
          { property: 'og:url', content: ogUrl },
          { name: 'twitter:url', content: ogUrl },
        ]
      : []),
  ]

  return tags
}
