const USAR_FIREBASE = true;

const PRODUCTOS_DE_PRUEBA = [
    { id: "p1", nombre: "Casado", precio: 3500 },
    { id: "p2", nombre: "Gallo pinto", precio: 2500 },
    { id: "p3", nombre: "Empanada de queso", precio: 1200 },
    { id: "p4", nombre: "Refresco natural", precio: 1000 },
    { id: "p5", nombre: "Tamal", precio: 1800 }
];

/**
 * Entrega al cliente el catalogo de productos registrados por el comercio.
 * Mientras USAR_FIREBASE sea false usa productos de prueba; en true consulta la coleccion "productos" de Firestore.
 */
export default class ProductosService {
    async listar() {
        if (USAR_FIREBASE) {
            return this.listarDesdeFirestore();
        }
        return PRODUCTOS_DE_PRUEBA;
    }

    async listarDesdeFirestore() {
        //El import lo pongo aqui para que no rompa la app si no se tiene configurado Firebase aun.
        const { db, collection, getDocs } = await import("../firebase.js");
        const respuesta = await getDocs(collection(db, "productos"));

        return respuesta.docs
            .map(documento => ({
                id: documento.id,
                nombre: documento.data().nombre,
                precio: Number(documento.data().precio)
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
}
