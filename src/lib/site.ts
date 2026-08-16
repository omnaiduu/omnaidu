export const SITE_URL = 'https://omnaidu.com'
export const SITE_NAME = 'Om Naidu'
export const SITE_EMAIL = 'hello@omnaidu.com'
export const SITE_EMAIL_HREF = `mailto:${SITE_EMAIL}`
export const GITHUB_URL = 'https://github.com/omnaiduu'
export const SITE_DESCRIPTION =
  'Software from Goa. I ship the system, then write what I shipped and how I checked it.'

export function ogImagePath(slug = 'site') {
  return `/og/${slug.replace(/\.png$/i, '')}.png`
}
