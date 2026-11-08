export default class PedidoController {
    constructor(vista, pedidosService, notificaciones) {
        this.vista = vista;
        this.pedidosService = pedidosService;
        this.notificaciones = notificaciones;
        this.primeraCarga = true;
    }

    iniciar() {
        this.vista.alPedirPermiso(() => this.notificaciones.pedirPermiso());
        this.vista.alEntregar((id, cliente) => this.entregar(id, cliente));

        this.pedidosService.escuchar((pedidos, nuevos) => {
            this.vista.mostrarPedidos(pedidos);

            // En la primera carga todos llegan como "nuevos": no se notifican
            if (!this.primeraCarga) {
                nuevos.forEach((p) => this.notificaciones.mostrar("Nuevo pedido de " + p.cliente));
            }
            this.primeraCarga = false;
        });
    }

    async entregar(id, cliente) {
        try {
            await this.pedidosService.marcarEntregado(id);
            const texto = `El pedido #${id} de ${cliente} ha sido marcado como entregado.`;
            this.vista.mostrarModal(texto);
            this.notificaciones.mostrar(texto);
        } catch (error) {
            console.error("Error al marcar como entregado:", error);
        }
    }
}