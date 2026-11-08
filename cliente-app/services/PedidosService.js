//guardar los pedidos en la coleccion de pedidos del firestore

import { db, collection, addDoc, serverTimestamp } from "../firebase.js";

export default class PedidosService {
  async registrar(cliente, pedido) {
    const referencia = await addDoc(collection(db, "pedidos"), {
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      productos: pedido.aDetalle(),
      total: pedido.total,
      estado: "pendiente",
      fecha: serverTimestamp(),
    });
    return referencia.id;
  }
}
