const {ProductManager} = require("./controllers/product-manager");
const { default: mongoose } = require("mongoose");
const manager = new ProductManager("./src/data/products.json")


const express = require("express");
const app = express();
const PUERTO = 8080;
const productRouter = require("./routes/products.router");
app.use(productRouter);
const cartRouter = require("./routes/cart.router");
app.use(cartRouter);
const viewsRouter = require("./routes/views.router");

mongoose.connect("mongodb+srv://agustinalvarez:Agusdb@cluster0.r0mj1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const socket = require("socket.io")

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas
app.use(express.json());
app.use(express.static("./src/public"));
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto https:localhost:${8080}`)
});



const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

    socket.on("mensaje", (data) => {
        console.log(data);
    })

    socket.emit("productos", await manager.getProducts());

    socket.on("eliminarProducto", async (id) =>{
        await manager.eliminarProducto(id); 
        io.socket.emit("productos", await manager.getProducts());
    })
})

