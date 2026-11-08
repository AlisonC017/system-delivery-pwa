export default class NotificacionesService {
    pedirPermiso() {
        return Notification.requestPermission();
    }

    async mostrar(mensaje) {
        try {
            if (Notification.permission !== "granted") return;
            const registro = await navigator.serviceWorker.ready;
            await registro.showNotification("Comercio PWA", {
                body: mensaje,
                icon: "/icons/icon-192.png",
            });
        } catch (error) {
            console.error("Error al notificar:", error);
        }
    }
}