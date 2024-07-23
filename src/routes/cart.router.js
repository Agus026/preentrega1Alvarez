const express = require('express');
const cart = express.Router();
cart.use(express.json());
const CarritoManager = require("../controllers/carrito-manager");
const manager = new CarritoManager("./src/data/carrito.json", "./src/data/products.json")
const { MiError } = require("../controllers/product-manager")

cart.post("/cart", async (req, res) => {
    try {
        let carrito = await manager.getNewCart()
        res.status(200).send(carrito)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error agregando el carrito")
    }

})

cart.get('/cart/:cid', async (req, res) => {
    const id = parseInt(req.params.cid)
    try {
        let miCarrito = await manager.listarProductos(id)
        res.status(200).send(miCarrito)
    } catch (error) {
        console.log(error)
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message })
        } else {
            res.status(500).send({ status: "Error", messsage: "Error finding the product" })
        }
    }
});

cart.post('/cart/:cid/product/:pid', async (req, res) => {

    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        await manager.agregarAlCarrito(cid, pid)
        res.status(201).send("Se agrego con exito")
    } catch (error) {
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message })
        } else {
            res.status(500).send({ status: "Error", messsage: "Error finding the product" })
        }
    }
});

module.exports = cart;