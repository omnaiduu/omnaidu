import { createServerFn } from '@tanstack/react-start'
import { renderServerComponent } from '@tanstack/react-start/rsc'
import { PostBody } from '~/components/PostBody'
import { cachedJson } from './cache'
import { getPost, listPosts, relatedPosts } from './db'
import type { PostTag } from './types'

type ListInput = { tag?: PostTag | 'all'; url: string }

function asRequest(url: string) {
  const absolute =
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://omnaidu.com${url.startsWith('/') ? url : `/${url}`}`
  return new Request(absolute)
}

export const fetchPosts = createServerFn({ method: 'GET' })
  .validator((input: ListInput) => input)
  .handler(async ({ data }) => {
    const tag = data.tag ?? 'all'
    return cachedJson(asRequest(data.url), `list:${tag}`, () => listPosts(tag))
  })

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((input: { slug: string; url: string }) => input)
  .handler(async ({ data }) => {
    return cachedJson(asRequest(data.url), `post:${data.slug}`, async () => {
      const post = await getPost(data.slug)
      if (!post) return null
      const related = await relatedPosts(data.slug, post.tag)
      return { post, related }
    })
  })

export const fetchPostPage = createServerFn({ method: 'GET' })
  .validator((input: { slug: string; url: string }) => input)
  .handler(async ({ data }) => {
    const packed = await cachedJson(asRequest(data.url), `post:${data.slug}`, async () => {
      const post = await getPost(data.slug)
      if (!post) return null
      const related = await relatedPosts(data.slug, post.tag)
      return { post, related }
    })
    if (!packed) return null
    const Body = await renderServerComponent(<PostBody markdown={packed.post.body} />)
    return { ...packed, Body }
  })
