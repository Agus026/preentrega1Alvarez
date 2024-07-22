const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager")
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
    let id = req.params.pid;

    const product = await manager.getProductById(parseInt(id));

    if (!product) {
        res.send("Prododuct Not Find")
    } else {
        res.send({ product });
    }
})
router.post("/products", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send({ message: "The new product was added succefuly" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: "Error", messsage: "Error when adding product" })
    }
})
router.put("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    const producto = req.body;

    try {
        await manager.actualizarProducto(parseInt(id),producto)
        res.status(201).send ({message: "The product was update succefuly"})
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: "Error", messsage: "Error when updateing product" })
    }
})


module.exports = router;