// sw.js — Funcionamiento sin conexión y notificaciones
// Una sola caché: guarda todos los archivos la primera vez, los sirve al instante
// y los actualiza en segundo plano (se ven en la siguiente apertura).
const CACHE = 'horario-v2';
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/tono.css',
  'css/style.css',
  'img/icono.svg',
  'img/icono-192.png',
  'img/icono-512.png',
  'img/icono-apple.png',
  'js/app.js',
  'js/componentes/abanico.js',
  'js/componentes/alerta.js',
  'js/componentes/dialogo.js',
  'js/componentes/dom.js',
  'js/componentes/hoja-nota.js',
  'js/componentes/hoja-turno.js',
  'js/componentes/hoja.js',
  'js/componentes/iconos.js',
  'js/componentes/interruptor.js',
  'js/componentes/medidas.js',
  'js/componentes/rueda.js',
  'js/componentes/segmentado.js',
  'js/componentes/tarjetas.js',
  'js/datos/almacenamiento.js',
  'js/datos/estado.js',
  'js/inicio/fondo-inicial.js',
  'js/nucleo/archivo-ics.js',
  'js/nucleo/avisos.js',
  'js/nucleo/color.js',
  'js/nucleo/mes.js',
  'js/nucleo/notas.js',
  'js/nucleo/nucleo.js',
  'js/nucleo/tiempo.js',
  'js/nucleo/turnos.js',
  'js/servicios/exportar.js',
  'js/servicios/fondos.js',
  'js/servicios/indicador.js',
  'js/servicios/notificaciones.js',
  'js/servicios/tema.js',
  'js/vistas/vista-ajustes.js',
  'js/vistas/vista-calendario.js',
  'js/vistas/vista-hoy.js',
  'js/vistas/vista-notas.js',
  'js/vistas/vista-plan.js',
  'js/vistas/vista-semana.js',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Primero la caché; en paralelo se actualiza desde la red
self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET' || new URL(peticion.url).origin !== self.location.origin) return;
  evento.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const guardada = await cache.match(peticion, { ignoreSearch: true });
      const red = fetch(peticion)
        .then((respuesta) => {
          if (respuesta.ok) cache.put(peticion, respuesta.clone());
          return respuesta;
        })
        .catch(() => guardada);
      return guardada || red;
    })
  );
});

// Al tocar una notificación se abre o enfoca la app
self.addEventListener('notificationclick', (evento) => {
  evento.notification.close();
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      const abierta = ventanas.find((v) => 'focus' in v);
      return abierta ? abierta.focus() : self.clients.openWindow('./');
    })
  );
});
