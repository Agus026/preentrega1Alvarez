const express = require('express');
const cart = express.Router();
cart.use(express.json());
const CarritoManager = require("../controllers/carrito-manager");
const manager = new CarritoManager("./src/data/carrito.json", "./src/data/products.json");
const { MiError } = require("../controllers/product-manager");

cart.post("/", async (req, res) => {
    try {
        let carrito = await manager.getNewCart()
        res.status(200).send(carrito)
    } catch (error) {
        console.log(error)
        res.status(500).send("Error agregando el carrito")
    }

})

cart.delete('/:cid/products/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    try {
        await manager.eliminarProductoDelCarrito(cid, pid);
        res.status(200).send(`Producto con id ${pid} eliminado del carrito ${cid}`);
    } catch (error) {
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ status: "Error", message: "Error eliminando el producto" });
        }
    }
});

cart.put('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const productos = req.body;
    try {
        await manager.actualizarCarrito(cid, productos);
        res.status(200).send(`Carrito ${cid} actualizado`);
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Error actualizando el carrito" });
    }
});

cart.put('/:cid/products/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const { cantidad } = req.body;
    try {
        await manager.actualizarCantidadProducto(cid, pid, cantidad);
        res.status(200).send(`Cantidad del producto ${pid} en el carrito ${cid} actualizada a ${cantidad}`);
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Error actualizando la cantidad del producto" });
    }
});

cart.delete('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
        await manager.eliminarTodosLosProductos(cid);
        res.status(200).send(`Todos los productos del carrito ${cid} han sido eliminados`);
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Error eliminando los productos del carrito" });
    }
});

cart.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);
    try {
        let miCarrito = await manager.listarProductosConPopulate(id);
        res.status(200).send(miCarrito);
    } catch (error) {
        console.log(error);
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message });
        } else {
            res.status(500).send({ status: "Error", message: "Error encontrando los productos" });
        }
    }
});

module.exports = cart;
