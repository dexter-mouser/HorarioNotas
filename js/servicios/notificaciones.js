// notificaciones.js — Permiso y notificación del sistema
// Requiere HTTPS; en iPhone, la app instalada en la pantalla de inicio (iOS 16.4+).

/** 'granted', 'denied', 'default' o 'no-disponible'. */
export function permisoActual() {
  return 'Notification' in window ? Notification.permission : 'no-disponible';
}

export function textoPermiso() {
  const textos = { granted: 'concedido', denied: 'denegado', default: 'sin solicitar', 'no-disponible': 'no disponible' };
  return textos[permisoActual()];
}

/** Solicita el permiso (debe llamarse tras un toque del usuario). */
export async function solicitarPermiso() {
  if (!('Notification' in window)) return 'no-disponible';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** Muestra una notificación del sistema si hay permiso. Devuelve true si se envió. */
export async function mostrarNotificacion(titulo, cuerpo) {
  if (permisoActual() !== 'granted') return false;
  try {
    const registro = await navigator.serviceWorker?.getRegistration();
    if (registro) {
      await registro.showNotification(titulo, { body: cuerpo, icon: 'img/icono-192.png', badge: 'img/icono-192.png' });
    } else {
      new Notification(titulo, { body: cuerpo, icon: 'img/icono-192.png' });
    }
    return true;
  } catch {
    return false;
  }
}
