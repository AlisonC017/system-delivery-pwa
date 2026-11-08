export default class UbicacionService {
  obtenerCoordenadas() {
    return new Promise((resolver, rechazar) => {
      if (!("geolocation" in navigator)) {
        rechazar(new Error("Su dispositivo no permite obtener la ubicación."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolver({
            latitud: pos.coords.latitude,
            longitud: pos.coords.longitude,
            precision: Math.round(pos.coords.accuracy),
          }),
        (err) => {
          const mensajes = {
            1: "Permiso de ubicación denegado. Actívelo en el navegador o escriba la dirección.",
            2: "No se pudo determinar su ubicación. Escriba la dirección.",
            3: "Se agotó el tiempo esperando la ubicación. Intente de nuevo.",
          };
          rechazar(
            new Error(mensajes[err.code] || "No se pudo obtener la ubicación."),
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    });
  }

  async obtenerDireccion(latitud, longitud) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${latitud}&lon=${longitud}`;
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("La direccion no es valida");
      const datos = await respuesta.json();
      return datos.display_name || null;
    } catch (error) {
      console.warn("No se pudo convertir la ubicacion en direccion", error);
      return null;
    }
  }

  async obtener() {
    const { latitud, longitud } = await this.obtenerCoordenadas();
    const direccion = await this.obtenerDireccion(latitud, longitud);
    // Si falla la conversión a texto, al menos queda el punto GPS como dirección
    return (
      direccion ||
      `Ubicación GPS: ${latitud.toFixed(6)}, ${longitud.toFixed(6)}`
    );
  }
}
