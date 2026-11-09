//las notificacionew del navegador 

export default class NotificacionesService {
    async pedirPermiso(){
        if(!("Notification" in window)){
            return "denied";

        }
        if (Notification.permission=== "default"){
            return Notification.requestPermission();
        }
        return Notification.permission;
    }

    async mostrar (titulo, cuerpo){
        if(!("Notification" in window) || Notification.permission!== "granted"){
            return;
        }
        const opciones = {body: cuerpo, icon: "images/logo.png"};

        try {
            const registro = "serviceWorker" in navigator
            ? await navigator.serviceWorker.getRegistration()
            :null;

            if(registro){
                await registro.showNotification(titulo, opciones);
            
            } else{
                new Notification(titulo, opciones);
            }
        } catch (error) {
            console.warn("No se logro mostrar la notificacion", error);
            
        }
    }
}