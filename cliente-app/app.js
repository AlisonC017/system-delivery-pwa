import Pedido from "./models/Pedido.js";
import ProductosService from "./services/ProductosService.js";
import PedidosService from "./services/PedidosService.js";
import NotificacionesService from "./services/NotificacionesService.js";
import PedidoVista from "./views/PedidoVista.js";
import PedidoController from "./controllers/PedidoController.js";

const pedido = new Pedido();
const vista = new PedidoVista();
const pedidoController = new PedidoController(pedido, vista, new ProductosService(), new PedidosService(), new NotificacionesService());

pedidoController.iniciar();
