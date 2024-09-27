const { ProductManager } = require("./controllers/product-manager");
const { default: mongoose } = require("mongoose");
const manager = new ProductManager("./src/data/products.json")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const MongoStore = require("connect-mongo");
const sessionRouter = require("../src/routes/session.router.js");
const passport = require("passport");
const iniatializePassport = require("./config/passport.config.js");

const express = require("express");
const app = express();
const PUERTO = 8080;

const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");

const socket = require("socket.io");
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public"));
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use(session({
    secret: "Valor Secreto",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://agustinalvarez:Agusdb@cluster0.r0mj1.mongodb.net/Sessiones?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

iniatializePassport();
app.use(passport.initialize());
app.use(passport.session());

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

