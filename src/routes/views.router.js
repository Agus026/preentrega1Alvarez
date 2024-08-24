const express = require ("express");
const router = express.Router();
const {ProductManager}  = require("../controllers/product-manager.js");
const manager = new ProductManager ("./src/data/products.json")



router.get("/api/products", async (req, res)=>{
    const productos = await manager.getProducts();
    res.render("home", {productos})
})

router.get("/products",async(req, res)=>{
    res.render("products")
})

module.exports = router;