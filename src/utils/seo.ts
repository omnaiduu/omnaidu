import { ogImagePath, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '~/lib/site'

const DEFAULT_OG_IMAGE = `${SITE_URL}${ogImagePath('site')}`

function isAbsolute(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function absoluteUrl(path: string): string {
  if (isAbsolute(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

function absoluteOgImage(path?: string): string {
  if (!path) return DEFAULT_OG_IMAGE
  if (isAbsolute(path)) return path
  const match = path.match(/^\/og\/(.+?)(?:\.png)?$/i)
  if (match) return `${SITE_URL}${ogImagePath(match[1])}`
  return absoluteUrl(path)
}

export const seo = ({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}) => {
  const ogImage = absoluteOgImage(image)
  const ogUrl = url ? absoluteUrl(url) : SITE_URL
  const desc = description ?? SITE_DESCRIPTION

  return [
    { title },
    { name: 'description', content: desc },
    { name: 'theme-color', content: '#14120b' },
    { name: 'color-scheme', content: 'dark' },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: desc },
    { property: 'og:url', content: ogUrl },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:secure_url', content: ogImage },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: title },
    { name: 'twitter:url', content: ogUrl },
  ]
}
