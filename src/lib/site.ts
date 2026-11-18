export const SITE_URL = 'https://omnaidu.com'
export const SITE_NAME = 'Om Naidu'
export const SITE_EMAIL = 'hello@omnaidu.com'
export const SITE_EMAIL_HREF = `mailto:${SITE_EMAIL}`
export const GITHUB_URL = 'https://github.com/omnaiduu'
export const SITE_DESCRIPTION =
  'AI engineer in Goa. I build search and agent systems around small open models, test them honestly, and write up what I find.'
export const OPEN_TO_WORK = 'Open to AI / ML engineering roles · remote or hybrid · India'

export function ogImagePath(slug = 'site') {
  return `/og/${slug.replace(/\.png$/i, '')}.png`
}
