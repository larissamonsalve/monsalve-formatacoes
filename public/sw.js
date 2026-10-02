// public/sw.js
const CACHE_NAME = 'monsalve-pwa-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/acesso',
        '/logo.jpg',
        '/logo2.jpg',
        '/manifest.webmanifest'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de API para não afetar o banco de dados/OTP
  if (event.request.url.includes('/api/')) {
    return;
  }

  // 1. Estratégia "Network First" para navegação de páginas (HTML)
  // Garante que o usuário sempre pegue o HTML mais recente com os hashes de CSS novos
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 2. Estratégia "Stale-While-Revalidate" para arquivos estáticos (CSS, Imagens, JS)
  // Responde rápido com o cache, mas atualiza o cache em background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Apenas faz cache de requisições válidas (evita erro de extensões de chrome, etc)
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Falha silenciosa caso esteja offline e não tenha no cache
      });

      return cachedResponse || fetchPromise;
    })
  );
});