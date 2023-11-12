self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
});
self.addEventListener('fetch', function(event) {
    if (event.request.url.indexOf('upload/file?token=') !== -1) {
        return;
    }
    console.log(event.request.url);
    event.respondWith(caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
    }));
});