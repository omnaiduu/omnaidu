const TTL_SECONDS = 60

function cacheKey(request: Request, extra: string) {
  const raw = request.url
  const path =
    raw.startsWith('http://') || raw.startsWith('https://')
      ? new URL(raw).pathname
      : raw.startsWith('/')
        ? raw
        : `/${raw}`
  return new Request(`https://cache.omnaidu.local${path}?${extra}`, {
    method: 'GET',
  })
}

export async function cachedJson<T>(
  request: Request,
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  try {
    const cache = caches.default
    const lookup = cacheKey(request, key)
    const hit = await cache.match(lookup)
    if (hit) {
      return (await hit.json()) as T
    }

    const data = await load()
    const response = new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, max-age=${TTL_SECONDS}`,
      },
    })
    await cache.put(lookup, response.clone())
    return data
  } catch {
    return load()
  }
}

const LIST_KEYS = ['list:all', 'list:projects', 'list:research', 'list:systems', 'list:writing']

export async function purgePostCaches(request: Request, slug?: string) {
  try {
    const cache = caches.default
    await Promise.all(LIST_KEYS.map((key) => cache.delete(cacheKey(request, key))))
    if (slug) {
      await cache.delete(cacheKey(request, `post:${slug}`))
    }
  } catch {
    // Preview accounts may not expose Cache API the same way.
  }
}
