import { db, msgsModel, productsModel } from "../dbmodels/dbsConfig.js";
import { productService } from "../controllers/productsController.js";
import contenedorMongo from "../contenedores/contenedorMongoDB.js";

const myChat = new contenedorMongo(db, msgsModel);

export const ioSockets = (io) => {
    io.on("connection", async socket => { 
        console.log("Un nuevo cliente se ha conectado");
     
        socket.emit("Mensajes", await myChat.getElems());
        socket.emit("Productos", await productService.getProducts());
    
        const data = await myChat.getElems();
    
        socket.on("new-message", async data => { 
            data.time = new Date().toLocaleString();
            io.sockets.emit("MensajeIndividual", data)
        })
    
        socket.on("nuevo-producto", async data => {
            const prods = await productService.getProducts();
            data.id = prods[prods.length - 1].id + 1;
            io.sockets.emit("ProductoIndividual", data)
        })
    })
}