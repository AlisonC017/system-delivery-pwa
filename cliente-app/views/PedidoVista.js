export default class PedidoVista {
  constructor() {
    this.formulario = document.getElementById("formAgregarProducto");
    this.selectProducto = document.getElementById("selectProducto");
    this.inputCantidad = document.getElementById("quantity");
    this.mensaje = document.getElementById("mensajeFormulario");
    this.botonUbicacion = document.getElementById("btnUbicacion");
    this.estadoUbicacion = document.getElementById("estadoUbicacion");
    this.listaPedido = document.getElementById("listaPedido");
    this.pedidoVacio = document.getElementById("pedidoVacio");
    this.totalPedido = document.getElementById("totalPedido");
    this.totalEncabezado = document.getElementById("totalEncabezado");
    this.cantidadItems = document.getElementById("cantidadItems");
    this.inputNombre = document.getElementById("inputNombre");
    this.inputDireccion = document.getElementById("inputDireccion");
    this.botonEnviar = document.getElementById("btnEnviarPedido");
    this.modalCuerpo = document.getElementById("modalConfirmacionCuerpo");
    this.modal = new bootstrap.Modal(
      document.getElementById("modalConfirmacion"),
    );
    this.formatoMoneda = new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  //envio del pedido (dila)

  alAgregar(manejador) {
    this.formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      manejador();
    });
  }

  alEliminar(manejador) {
    this.listaPedido.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-id]");
      if (boton) {
        manejador(boton.dataset.id);
      }
    });
  }

  alEnviar(manejador) {
    this.botonEnviar.addEventListener("click", manejador);
  }

  datosCliente() {
    return {
      nombre: this.inputNombre.value.trim(),
      direccion: this.inputDireccion.value.trim(),
    };
  }

  bloquearEnvio(bloquear) {
    this.botonEnviar.disabled = bloquear;
    this.botonEnviar.textContent = bloquear ? "Enviando..." : "Enviar pedido";
  }

  limpiarCliente() {
    this.inputNombre.value = "";
    this.inputDireccion.value = "";
    this.inputDireccion.readOnly = true;
    this.estadoUbicacion.textContent = "";
  }

  alUbicar(manejador) {
    this.botonUbicacion.addEventListener("click", manejador);
  }

  bloquearUbicacion(bloquear) {
    this.botonUbicacion.disabled = bloquear;
  }

  mostrarEstadoUbicacion(texto) {
    this.estadoUbicacion.textContent = texto;
  }

  mostrarDireccion(texto) {
    this.inputDireccion.value = texto;
    this.inputDireccion.readOnly = true;
  }

  // Respaldo: si el GPS falla o se niega el permiso, se permite escribirla
  permitirDireccionManual() {
    this.inputDireccion.readOnly = false;
    this.inputDireccion.placeholder = "Escriba su dirección de entrega";
  }

  mostrarConfirmacion(id, nombre) {
    this.modalCuerpo.textContent = `Gracias ${nombre}, tu pedido #${id} fue registrado correctamente`;
    this.modal.show();
  }
  //(fin)

  mostrarProductos(productos) {
    this.selectProducto.replaceChildren(
      new Option("Seleccione un producto", ""),
    );
    productos.forEach((producto) => {
      const texto = `${producto.nombre} - ${this.formatoMoneda.format(producto.precio)}`;
      this.selectProducto.add(new Option(texto, producto.id));
    });
  }

  mostrarErrorCarga(texto) {
    this.selectProducto.replaceChildren(new Option(texto, ""));
    this.selectProducto.disabled = true;
  }

  productoSeleccionado() {
    return this.selectProducto.value;
  }

  cantidadIngresada() {
    return Number(this.inputCantidad.value.trim());
  }

  reiniciarFormulario() {
    this.selectProducto.value = "";
    this.inputCantidad.value = 1;
  }

  mostrarMensaje(texto) {
    this.mensaje.textContent = texto;
    this.mensaje.classList.remove("d-none");
  }

  ocultarMensaje() {
    this.mensaje.classList.add("d-none");
  }

  mostrarPedido(pedido) {
    this.listaPedido.replaceChildren(
      ...pedido.items.map((item) => this.crearFila(item)),
    );
    this.pedidoVacio.classList.toggle("d-none", !pedido.estaVacio());

    const total = this.formatoMoneda.format(pedido.total);
    this.totalPedido.textContent = total;
    this.totalEncabezado.textContent = total;
    this.cantidadItems.textContent = pedido.cantidadUnidades;
  }

  crearFila(item) {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = item.nombre;

    const celdaCantidad = document.createElement("td");
    celdaCantidad.className = "text-center";
    celdaCantidad.textContent = item.cantidad;

    const celdaSubtotal = document.createElement("td");
    celdaSubtotal.className = "text-end";
    celdaSubtotal.textContent = this.formatoMoneda.format(item.subtotal);

    const celdaAccion = document.createElement("td");
    celdaAccion.className = "text-end";

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-outline-danger";
    botonEliminar.dataset.id = item.productoId;
    botonEliminar.setAttribute("aria-label", `Eliminar ${item.nombre}`);
    botonEliminar.textContent = "✕";
    celdaAccion.append(botonEliminar);

    fila.append(celdaNombre, celdaCantidad, celdaSubtotal, celdaAccion);
    return fila;
  }
}
