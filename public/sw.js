const APP_CACHE = 'gather-thyme-app-v1'
const API_CACHE = 'gather-thyme-api-v1'
const IMAGE_CACHE = 'gather-thyme-images-v1'
const OWNED_CACHES = [APP_CACHE, API_CACHE, IMAGE_CACHE]
const MEALDB_HOST = 'www.themealdb.com'

self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheAppShell()
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('gather-thyme-') && !OWNED_CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_FAVORITE_IMAGE' || typeof event.data.url !== 'string') return

  let imageUrl
  try {
    imageUrl = new URL(event.data.url)
  } catch (error) {
    console.error('Could not cache the favorite image because its URL is invalid.', error)
    return
  }
  if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== MEALDB_HOST) return

  event.waitUntil(cacheMealImage(new Request(imageUrl.href, { mode: 'no-cors' })))
})

async function cacheAppShell() {
  const cache = await caches.open(APP_CACHE)
  const response = await fetch('/')
  if (!response.ok) throw new Error(`Could not cache the app shell (${response.status}).`)
  await cache.put('/', response.clone())
  await cache.put('/index.html', response.clone())

  const html = await response.text()
  const resources = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin)
  await Promise.all(resources.map(async (url) => {
    const asset = await fetch(url)
    if (asset.ok) await cache.put(url.href, asset)
  }))
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.hostname === MEALDB_HOST && url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  if (url.hostname === MEALDB_HOST && request.destination === 'image') {
    event.respondWith(cacheFirstImage(request))
    return
  }

  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request))
    return
  }

  event.respondWith(cacheFirst(request, APP_CACHE))
})

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) await cacheResponse(cache, request, response.clone())
    return response
  } catch (error) {
    const cached = await cache.match(request, { ignoreVary: true })
    if (cached) return cached
    throw error
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(APP_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cacheResponse(cache, '/index.html', response.clone())
    return response
  } catch (error) {
    const cached = await cache.match('/index.html', { ignoreVary: true })
    if (cached) return cached
    throw error
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) await cacheResponse(cache, request, response.clone())
  return response
}

async function cacheFirstImage(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return cached

  return cacheMealImage(request)
}

async function cacheMealImage(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok || response.type === 'opaque') await cacheResponse(cache, request, response.clone())
  return response
}

async function cacheResponse(cache, request, response) {
  try {
    await cache.put(request, response)
  } catch (error) {
    console.error('Could not cache an offline resource.', error)
  }
}
