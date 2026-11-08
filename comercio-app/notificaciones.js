/**
 * Notificaciones del navegador (Notifications API) para la app del comercio.
 *
 * Se muestran con registration.showNotification() (a través del service worker)
 * porque en Android/Chrome `new Notification()` falla en una PWA instalada.
 * Si no hay service worker, se usa `new Notification()` como respaldo.
 */

const ICONO = "icons/icon-192.png";

export function notificacionesSoportadas() {
    return "Notification" in window;
}

export function estadoPermiso() {
    return notificacionesSoportadas() ? Notification.permission : "unsupported";
}

/**
 * Pide permiso. En iOS y en varios navegadores DEBE llamarse desde un gesto
 * del usuario (un clic), por eso se conecta a un botón y no se llama al cargar.
 */
export async function solicitarPermisoNotificaciones() {
    if (!notificacionesSoportadas()) return "unsupported";
    if (Notification.permission !== "default") return Notification.permission;
    return await Notification.requestPermission();
}

async function mostrar(titulo, opciones = {}) {
    if (!notificacionesSoportadas() || Notification.permission !== "granted") return;

    const config = { icon: ICONO, badge: ICONO, ...opciones };
    try {
        const reg = await navigator.serviceWorker?.getRegistration();
        if (reg) {
            await reg.showNotification(titulo, config);
            return;
        }
    } catch (error) {
        console.warn("showNotification falló, usando Notification()", error);
    }
    new Notification(titulo, config);
}

/** Aviso cuando entra un pedido nuevo. */
export function notificarNuevoPedido(pedido) {
    const total = new Intl.NumberFormat("es-CR", {
        style: "currency", currency: "CRC", maximumFractionDigits: 0
    }).format(pedido.total ?? 0);

    return mostrar("🛒 Nuevo pedido recibido", {
        body: `${pedido.cliente} · ${pedido.direccion}\nTotal: ${total}`,
        tag: `nuevo-${pedido.id}`   // evita duplicados del mismo pedido
    });
}

/** Aviso al marcar un pedido como entregado (identificador + nombre del cliente). */
export function notificarEntrega(pedidoId, cliente) {
    return mostrar("✅ Pedido entregado", {
        body: `El pedido #${pedidoId} de ${cliente} fue marcado como entregado.`,
        tag: `entregado-${pedidoId}`
    });
}

/**
 * Conecta un botón "Activar notificaciones" y lo oculta cuando ya hay permiso.
 * Uso: iniciarBotonNotificaciones("btnNotificaciones");
 */
export function iniciarBotonNotificaciones(idBoton) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;

    const actualizar = () => {
        const permiso = estadoPermiso();
        boton.classList.toggle("d-none", permiso === "granted" || permiso === "unsupported");
        if (permiso === "denied") {
            boton.textContent = "Notificaciones bloqueadas (actívelas en el navegador)";
            boton.disabled = true;
        }
    };

    boton.addEventListener("click", async () => {
        await solicitarPermisoNotificaciones();
        actualizar();
    });
    actualizar();
}
