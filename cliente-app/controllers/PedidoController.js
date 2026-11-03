/**
 * Coordina el catalogo de productos con el pedido en construccion: carga el select,
 * agrega y elimina lineas, y pide a la vista que recalcule el total.
 */
export default class PedidoController {
    constructor(pedido, vista, productosService) {
        this.pedido = pedido;
        this.vista = vista;
        this.productosService = productosService;
        this.productos = new Map();
    }

    async iniciar() {
        this.vista.alAgregar(() => this.agregarProducto());
        this.vista.alEliminar(productoId => this.eliminarProducto(productoId));
        this.vista.mostrarPedido(this.pedido);
        await this.cargarProductos();
    }

    async cargarProductos() {
        try {
            const productos = await this.productosService.listar();
            productos.forEach(producto => this.productos.set(producto.id, producto));
            this.vista.mostrarProductos(productos);
        } catch (error) {
            console.error("Error al cargar los productos", error);
            this.vista.mostrarErrorCarga("No se pudieron cargar los productos");
        }
    }

    agregarProducto() {
        const producto = this.productos.get(this.vista.productoSeleccionado());
        const cantidad = this.vista.cantidadIngresada();

        if (!producto) {
            this.vista.mostrarMensaje("Seleccione un producto.");
            return;
        }

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            this.vista.mostrarMensaje("La cantidad debe ser un número entero mayor a cero.");
            return;
        }

        this.vista.ocultarMensaje();
        this.pedido.agregar(producto, cantidad);
        this.vista.mostrarPedido(this.pedido);
        this.vista.reiniciarFormulario();
    }

    eliminarProducto(productoId) {
        this.pedido.eliminar(productoId);
        this.vista.mostrarPedido(this.pedido);
    }
}
