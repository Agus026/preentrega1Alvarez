const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager")
const manager = new ProductManager("./src/data/products.json")


router.get("/products", async (req, res)=>{
    let limit = req.query.limit;
    try {
        const arrayProducts = await manager.getProducts();

        if (limit) {
            res.send(arrayProducts.slice(0, limit));
        }else {
            res.send(arrayProducts);
        }

    } catch (error) {
        console.log(error)
        res.status (500).send("Error del servidor")
    }
})



module.exports = router;