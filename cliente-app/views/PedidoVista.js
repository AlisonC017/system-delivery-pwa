export default class PedidoVista {
    constructor() {
        this.formulario = document.getElementById("formAgregarProducto");
        this.selectProducto = document.getElementById("selectProducto");
        this.inputCantidad = document.getElementById("quantity");
        this.mensaje = document.getElementById("mensajeFormulario");
        this.listaPedido = document.getElementById("listaPedido");
        this.pedidoVacio = document.getElementById("pedidoVacio");
        this.totalPedido = document.getElementById("totalPedido");
        this.totalEncabezado = document.getElementById("totalEncabezado");
        this.cantidadItems = document.getElementById("cantidadItems");
        this.formatoMoneda = new Intl.NumberFormat("es-CR", {
            style: "currency",
            currency: "CRC",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    alAgregar(manejador) {
        this.formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            manejador();
        });
    }

    alEliminar(manejador) {
        this.listaPedido.addEventListener("click", evento => {
            const boton = evento.target.closest("[data-id]");
            if (boton) {
                manejador(boton.dataset.id);
            }
        });
    }

    mostrarProductos(productos) {
        this.selectProducto.replaceChildren(new Option("Seleccione un producto", ""));
        productos.forEach(producto => {
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
        this.listaPedido.replaceChildren(...pedido.items.map(item => this.crearFila(item)));
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
