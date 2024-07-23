const express = require ("express");
const app = express();
const PUERTO = 8080;
const productRouter = require ("./routes/products.router");
app.use(productRouter)
const cartRouter = require ("./routes/cart.router");
app.use(cartRouter)








app.listen(PUERTO, () => {
    console.log("Escuchando puerto 8080")
})