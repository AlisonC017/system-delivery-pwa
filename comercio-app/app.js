import PedidosService from "./services/PedidosService.js";
import NotificacionesService from "./services/NotificacionesService.js";
import PedidoView from "./views/PedidoView.js";
import PedidoController from "./controllers/PedidoController.js";

const controller = new PedidoController(new PedidoView(), new PedidosService(), new NotificacionesService());

controller.iniciar();