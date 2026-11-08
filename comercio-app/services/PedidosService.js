import {
    db, collection, query, orderBy, onSnapshot, doc, updateDoc,
} from "../firebase.js";
import Pedido from "../models/Pedido.js";

export default class PedidosService {
    constructor() {
        this.coleccion = "pedidos";
    }

    escuchar(callback) {
        const q = query(collection(db, this.coleccion), orderBy("fecha", "desc"));

        return onSnapshot(q, (snapshot) => {
            const pedidos = snapshot.docs.map((d) => new Pedido(d.id, d.data()));
            const nuevos = snapshot.docChanges()
                .filter((c) => c.type === "added")
                .map((c) => new Pedido(c.doc.id, c.doc.data()));
            callback(pedidos, nuevos);
        }, (error) => {
            console.error(error);
            $("#listaPedidos").html(`<p class="text-center text-danger">Error: ${error.message}</p>`);
        });
    }

    marcarEntregado(id) {
        return updateDoc(doc(db, this.coleccion, id), { estado: "entregado" });
    }
}