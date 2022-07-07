const express = require('express');
const { Router } = express;

const Api = require("./apiFunc.js");
const Carrito = require("./carritoFunc.js")

const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = 8080 || process.env.PORT;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 


const miApi = new Api("productos.json");
const miCarr = new Carrito("carrito.json")

//Productos

router.get('/productos', (req, res) => {
    return miApi.getProducts(req, res)
 })

router.get('/productos/:id', (req, res) => {
    return  miApi.getProduct(req, res)
 })


router.post('/productos', (req, res) => {
    return miApi.postProduct(req, res)
 })

 router.put("/productos/:id", (req, res) => {
    return miApi.putProduct(req, res)
})

router.delete("/productos/:id", (req, res) => {
    return miApi.deleteProduct(req, res)
})

//Carrito

router.get('/carrito/:id/productos', (req, res) => {
    return miCarr.getCartProducts(req, res)
 })

router.post('/carrito/', async (req, res) => {
    return await miCarr.newCart(req, res)
 })

router.get('/carrito/', (req, res) => {
    return miCarr.getCart(req, res)
 })

router.post('/carrito/:id/productos', (req, res) => {
    return miCarr.postProduct(req, res)
 })

router.delete("/carrito/:id", (req, res) => {
    return miCarr.deleteCart(req, res)
})

router.delete("/carrito/:id/productos/:id_prod", (req, res) => {
    return miCarr.deleteCartProduct(req, res)
})


app.use('/api', router);
app.use((req, res, next) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
  });