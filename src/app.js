const { ProductManager } = require("./controllers/product-manager");
const { default: mongoose } = require("mongoose");
const manager = new ProductManager("./src/data/products.json")


const express = require("express");
const app = express();
const PUERTO = 8080;

const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");
const viewsRouter = require("./routes/views.router");

const socket = require("socket.io");
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.static("./src/public"));
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/products", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto https://localhost:${PUERTO}`);
});

const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    socket.on("mensaje", (data) => {
        console.log(data);
    });

    io.emit("productos", await manager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await manager.eliminarProducto(id);
        io.emit("productos", await manager.getProducts());
    });
});
