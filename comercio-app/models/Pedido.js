export default class Pedido {
    constructor(id, datos) {
        this.id = id;
        this.cliente = datos.nombre;
        this.direccion = datos.direccion;
        this.productos = datos.productos || [];
        this.total = datos.total;
        this.estado = datos.estado;
    }

    get entregado() {
        return this.estado === "entregado";
    }
}