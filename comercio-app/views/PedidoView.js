function escapar(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function colones(monto) {
    return "₡" + Number(monto).toLocaleString("es-CR");
}

function crearTarjeta(pedido) {
    const filas = pedido.productos.map((p) => `
    <tr>
      <td>${escapar(p.nombre)}</td>
      <td>${p.cantidad} x ${colones(p.precio)}</td>
      <td class="text-right">${colones(p.cantidad * p.precio)}</td>
    </tr>`).join("");

    const accion = pedido.entregado
        ? `<span class="badge badge-success mt-2">Entregado</span>`
        : `<button type="button" class="btn btn-primary btn-block mt-2 btn-entregar"
         data-id="${escapar(pedido.id)}" data-cliente="${escapar(pedido.cliente)}">
         ✓ Marcar como entregado
       </button>`;

    return `
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <h5 class="mb-2">#${escapar(pedido.id)}</h5>
        <div><b>Cliente:</b> ${escapar(pedido.cliente)}</div>
        <div><b>Dirección:</b> ${escapar(pedido.direccion)}</div>
        <table class="table table-sm mt-2 mb-2"><tbody>${filas}</tbody></table>
        <div class="d-flex justify-content-between font-weight-bold">
          <span>Total</span><span>${colones(pedido.total)}</span>
        </div>
        ${accion}
      </div>
    </div>`;
}

export default class PedidoVista {
    mostrarPedidos(pedidos) {
        $("#listaPedidos").empty();

        if (pedidos.length === 0) {
            $("#listaPedidos").append(`<p class="text-center text-muted">Aún no hay pedidos.</p>`);
            return;
        }
        pedidos.forEach((p) => $("#listaPedidos").append(crearTarjeta(p)));
    }

    mostrarModal(texto) {
        $("#modalEntregaTexto").text(texto);
        $("#modalEntrega").modal("show");
    }

    alEntregar(manejador) {
        $(document).on("click", ".btn-entregar", function () {
            manejador($(this).attr("data-id"), $(this).attr("data-cliente"));
        });
    }

    alPedirPermiso(manejador) {
        $(document).on("click", "#btn-permiso-notificaciones", manejador);
    }
}