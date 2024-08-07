const express = require ("express");
const router = express.Router();
const {ProductManager}  = require("../controllers/product-manager.js");
const manager = new ProductManager ("./src/data/products.json")



router.get("/product", async (req, res)=>{
    const productos = await manager.getProducts();
    res.render("home", {productos})
})

router.get("/realtimeproducts",async(req, res)=>{
    res.render("realtimeproducts")
})

module.exports = router;