import ItemPedido from "./ItemPedido.js";

/**
 * Pedido que el cliente va armando antes de enviarlo al comercio.
 * Si un producto ya esta en el pedido, se suma la cantidad en lugar de duplicar la linea.
 */
export default class Pedido {
    constructor() {
        this.items = [];
    }

    agregar(producto, cantidad) {
        if (!Number.isInteger(cantidad) || cantidad < 1) {
            throw new Error("La cantidad debe ser un entero mayor a cero");
        }
        const existente = this.items.find(item => item.productoId === producto.id);

        if (existente) {
            existente.cantidad += cantidad;
            return;
        }
        this.items.push(new ItemPedido(producto, cantidad));
    }

    eliminar(productoId) {
        this.items = this.items.filter(item => item.productoId !== productoId);
    }

    vaciar() {
        this.items = [];
    }

    estaVacio() {
        return this.items.length === 0;
    }

    get total() {
        const suma = this.items.reduce((acumulado, item) => acumulado + item.subtotal, 0);
        return Math.round(suma * 100) / 100;
    }

    get cantidadUnidades() {
        return this.items.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    }

    /**
     * Devuelve objetos planos listos para guardar en Firestore, que no acepta instancias de clases.
     */
    aDetalle() {
        return this.items.map(item => ({
            productoId: item.productoId,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.subtotal
        }));
    }
}
