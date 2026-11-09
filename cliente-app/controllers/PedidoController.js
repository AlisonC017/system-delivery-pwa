/**
 * Coordina el catalogo de productos con el pedido en construccion: carga el select,
 * agrega y elimina lineas, y pide a la vista que recalcule el total.
 */
export default class PedidoController {
  constructor(
    pedido,
    vista,
    productosService,
    pedidosService,
    notificador,
    ubicacionService,
  ) {
    this.pedido = pedido;
    this.vista = vista;
    this.productosService = productosService;
    this.pedidosService = pedidosService;
    this.notificador = notificador;
    this.productos = new Map();
    this.ubicacionService = ubicacionService;
    this.ubicacion = null;
  }

  async iniciar() {
    this.vista.alAgregar(() => this.agregarProducto());
    this.vista.alEliminar((productoId) => this.eliminarProducto(productoId));
    this.vista.alUbicar(() => this.obtenerUbicacion());
    this.vista.alEnviar(() => this.enviarPedido());
    this.vista.mostrarPedido(this.pedido);
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      const productos = await this.productosService.listar();
      productos.forEach((producto) =>
        this.productos.set(producto.id, producto),
      );
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
      this.vista.mostrarMensaje(
        "La cantidad debe ser un número entero mayor a cero.",
      );
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
  //validar, guardar y condirmar (dila)
  async enviarPedido() {
    const cliente = this.vista.datosCliente();
    cliente.ubicacion = this.ubicacion;

    if (this.pedido.estaVacio()) {
      this.vista.mostrarMensaje("Agregue por lo menos un producto al pedido");
      return;
    }
    if (!cliente.nombre || !cliente.direccion) {
      this.vista.mostrarMensaje(
        "Ingrese su nombre, junto a la direccion de entrega",
      );
      return;
    }

    this.vista.ocultarMensaje();
    const permiso = this.notificador.pedirPermiso();
    this.vista.bloquearEnvio(true);

    try {
      const id = await this.pedidosService.registrar(cliente, this.pedido);
      this.vista.mostrarConfirmacion(id, cliente.nombre);
      await permiso;
            this.notificador.mostrar(
        "Pedido enviado!",
        `Tu pedido #${id.slice(0, 6).toUpperCase()} fue registrado correctamente`,
      );

      this.pedido.vaciar();
      this.vista.mostrarPedido(this.pedido);
      this.vista.limpiarCliente();
      this.ubicacion = null;
    } catch (error) {
      console.error("Error al registrar el pedido", error);
      this.vista.mostrarMensaje(
        "No se pudo enviar el pedido. Intente nuevamente",
      );
    } finally {
      this.vista.bloquearEnvio(false);
    }
  }

  async obtenerUbicacion() {
    this.vista.bloquearUbicacion(true);
    this.vista.mostrarEstadoUbicacion("Obteniendo ubicación...");
    try {
      const direccion = await this.ubicacionService.obtener();
      this.vista.mostrarDireccion(direccion);
      this.vista.mostrarEstadoUbicacion("Ubicación obtenida");
    } catch (error) {
      this.vista.permitirDireccionManual();
      this.vista.mostrarEstadoUbicacion(error.message);
    } finally {
      this.vista.bloquearUbicacion(false);
    }
  }
}
