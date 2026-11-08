// Registra el service worker (requiere HTTPS; Netlify ya lo provee, y localhost también sirve).
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then((reg) => console.log("Service worker registrado. Alcance:", reg.scope))
            .catch((err) => console.error("No se pudo registrar el service worker", err));
    });
}
