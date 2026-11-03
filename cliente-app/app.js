import Pedido from "./models/Pedido.js";
import ProductosService from "./services/ProductosService.js";
import PedidoVista from "./views/PedidoVista.js";
import PedidoController from "./controllers/PedidoController.js";

const pedido = new Pedido();
const vista = new PedidoVista();
const pedidoController = new PedidoController(pedido, vista, new ProductosService());

pedidoController.iniciar();
