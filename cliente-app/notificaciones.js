/**
 * Notificaciones del navegador para la app del cliente.
 * Usa registration.showNotification() (service worker) con respaldo a new Notification().
 */
const ICONO = "icons/icon-192.png";

export function notificacionesSoportadas() {
    return "Notification" in window;
}

/** Debe llamarse desde un gesto del usuario (p. ej. al pulsar "Enviar pedido"). */
export async function solicitarPermisoNotificaciones() {
    if (!notificacionesSoportadas()) return "unsupported";
    if (Notification.permission !== "default") return Notification.permission;
    return await Notification.requestPermission();
}

export async function notificarPedidoEnviado(pedidoId, nombre) {
    if (!notificacionesSoportadas() || Notification.permission !== "granted") return;
    const titulo = "✅ Pedido registrado";
    const config = {
        body: `Gracias ${nombre}, su pedido #${pedidoId} fue enviado correctamente.`,
        icon: ICONO, badge: ICONO, tag: `enviado-${pedidoId}`
    };
    try {
        const reg = await navigator.serviceWorker?.getRegistration();
        if (reg) { await reg.showNotification(titulo, config); return; }
    } catch (e) { console.warn(e); }
    new Notification(titulo, config);
}
