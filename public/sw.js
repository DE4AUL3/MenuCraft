const CACHE_NAME = 'catalog-cafe-v1'
const STATIC_CACHE = 'static-v1'
const RUNTIME_CACHE = 'runtime-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/panda_logo.jpg',
  '/han_tagam2..jpg',
  '/Sweet.jpg',
  '/khan-tagam-logo.svg',
  '/panda-burger-logo.svg'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Static assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const deletePromises = cacheNames
          .filter(cacheName => 
            cacheName !== STATIC_CACHE && 
            cacheName !== RUNTIME_CACHE
          )
          .map(cacheName => {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
        
        return Promise.all(deletePromises)
      })
      .then(() => {
        console.log('✅ Old caches cleaned up')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE)
              .then(cache => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Fallback to cache when offline
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return offline fallback
              return new Response(JSON.stringify({
                error: 'Offline',
                message: 'Нет подключения к интернету'
              }), {
                headers: { 'Content-Type': 'application/json' }
              })
            })
        })
    )
    return
  }

  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(request)
            .then(response => {
              const responseClone = response.clone()
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone))
              return response
            })
        })
    )
    return
  }

  // Handle page requests with network-first, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful page responses
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, responseClone))
          return response
        })
        .catch(() => {
          // Fallback to cached page or offline page
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return cached home page as fallback
              return caches.match('/')
            })
        })
    )
    return
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Don't cache non-successful responses
        if (!response.ok) {
          return response
        }

        const responseClone = response.clone()
        caches.open(RUNTIME_CACHE)
          .then(cache => {
            cache.put(request, responseClone)
          })
        
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Background sync for offline orders
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(
      syncOrders()
    )
  }
})

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/panda_logo.jpg',
    badge: '/panda_logo.jpg',
    image: '/han_tagam.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть приложение',
        icon: '/panda_logo.jpg'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/panda_logo.jpg'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Catalog Cafe', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync helper
async function syncOrders() {
  try {
    // Get pending orders from IndexedDB
    const pendingOrders = await getPendingOrders()
    
    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        })

        if (response.ok) {
          // Remove from pending orders
          await removePendingOrder(order.id)
          console.log('✅ Order synced:', order.id)
          
          // Show success notification
          self.registration.showNotification('Заказ отправлен', {
            body: `Заказ #${order.id} успешно отправлен`,
            icon: '/panda_logo.jpg',
            tag: 'order-success'
          })
        }
      } catch (error) {
        console.error('❌ Failed to sync order:', order.id, error)
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error)
  }
}

// IndexedDB helpers for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CatalogCafeDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = () => {
      const db = request.result
      
      // Create orders store
      if (!db.objectStoreNames.contains('orders')) {
        const ordersStore = db.createObjectStore('orders', { keyPath: 'id' })
        ordersStore.createIndex('timestamp', 'timestamp', { unique: false })
        ordersStore.createIndex('status', 'status', { unique: false })
      }
      
      // Create favorites store
      if (!db.objectStoreNames.contains('favorites')) {
        const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id' })
        favoritesStore.createIndex('restaurantId', 'restaurantId', { unique: false })
      }
    }
  })
}

async function getPendingOrders() {
  const db = await openDB()
  const transaction = db.transaction(['orders'], 'readonly')
  const store = transaction.objectStore('orders')
  const index = store.index('status')
  
  return new Promise((resolve, reject) => {
    const request = index.getAll('pending')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

async function removePendingOrder(orderId) {
  const db = await openDB()
  const transaction = db.transaction(['orders'], 'readwrite')
  const store = transaction.objectStore('orders')
  
  return new Promise((resolve, reject) => {
    const request = store.delete(orderId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
  const { type, data } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size })
      })
      break
      
    case 'CLEAR_CACHE':
      clearCache().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
  }
})

async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    
    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size
      }
    }
  }
  
  return totalSize
}

async function clearCache() {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName !== STATIC_CACHE) {
        return caches.delete(cacheName)
      }
    })
  )
}