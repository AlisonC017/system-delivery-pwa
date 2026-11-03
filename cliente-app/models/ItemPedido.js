export default class ItemPedido {
    constructor(producto, cantidad) {
        this.productoId = producto.id;
        this.nombre = producto.nombre;
        this.precio = producto.precio;
        this.cantidad = cantidad;
    }

    get subtotal() {
        return Math.round(this.precio * this.cantidad * 100) / 100;
    }
}
