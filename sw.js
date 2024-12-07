// sw.js
const CACHE_NAME = 'historin-cache-v3';
const STATIC_FILES = [
  '/index.html',
  '/styles3.4.css',
  '/bd.js',
  'https://unpkg.com/react@17/umd/react.production.min.js',
  'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  'https://unpkg.com/react-router-dom@5/umd/react-router-dom.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&family=Inter:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
  'https://www.googletagmanager.com/gtag/js?id=G-6RZP5DGP0E',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Adicionando arquivos estáticos ao cache');
      return cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
  
    if (request.destination === 'image') {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Se a imagem já estiver no cache, retorna ela
            return cachedResponse;
          }
          // Caso contrário, busca na rede e armazena no cache
          return fetch(request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }).catch((error) => {
            console.error('Erro ao buscar a imagem:', error);
            return new Response(''); // Opcional: Retorna vazio em caso de erro
          });
        })
      );
    } else {
      // Tratamento para outros tipos de requisição (CSS, JS, etc.)
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          return cachedResponse || fetch(request).then((networkResponse) => {
            if (request.method === 'GET') {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          });
        })
      );
    }
  });
  

// Limpa caches antigos quando o SW é ativado
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
