const express = require("express");
const router = express.Router();
const { MiError, ProductManager } = require("../controllers/product-manager")
const manager = new ProductManager("./src/data/products.json")



router.use(express.json());

router.get("/products", async (req, res) => {
    let limit = req.query.limit;
    try {
        const arrayProducts = await manager.getProducts();

        if (limit) {
            res.send(arrayProducts.slice(0, limit));
        } else {
            res.send(arrayProducts);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Error del servidor")
    }
})

router.get("/products/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        const product = await manager.getProductById(parseInt(id));
        res.status(200).send(product)
    } catch (error) {
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message })
        } else {
            res.send(500).send({status: "Error", message: "Error when adding product"});
        }
    }


})
router.post("/products", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send({ message: "The new product was added succefuly" })
    } catch (error) {
        console.log(error)
        if (error instanceof MiError) {
            res.status(400).send({ message: error.message })
        } else {
            res.status(500).send({ status: "Error", messsage: "Error when adding product" })
        }
    }
})
router.put("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    const producto = req.body;
    try {
        await manager.actualizarProducto(parseInt(id), producto)
        res.status(201).send({ message: "The product was update succefuly" })
    } catch (error) {

        if (error instanceof MiError) {
            res.status(404).send({ message: error.message })
        } else {
            res.status(500).send({ messsage: "Error when updateing product" })
        }
    }
})
router.delete('/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
        let respuesta = await manager.eliminarProducto(pid)

        res.status(200).send({ mensage: respuesta })


    } catch (error) {
        if (error instanceof MiError) {
            res.status(404).send({ message: error.message })
        } else {
            console.log(error)
            res.status(500).send({ status: "Error", messsage: "Error when deleting product" })
        }
    }
});


module.exports = router;