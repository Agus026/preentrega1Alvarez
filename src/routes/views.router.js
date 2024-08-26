const express = require("express");
const router = express.Router();
const { ProductManager } = require("../controllers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");
const productModel = require("../Models/product.model.js");
const mongoose = require("mongoose");

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://agustinalvarez:Agusdb@cluster0.r0mj1.mongodb.net/Proyectofinal?retryWrites=true&w=majority&appName=Cluster0");
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
        process.exit(1); 
    }
}
//mongodb://localhost:27017/
//

connectToDatabase();

    
    
    router.get("/", async (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let query = req.query.query ? { $text: { $search: req.query.query } } : {};
    
        try {
            const ProductList = await productModel.paginate(query, { limit, page });
    
            const productFinal = ProductList.docs.map(product => {
                const { _id, ...rest } = product.toObject();
                return rest;
            });
            res.render("products", {
                products: productFinal,
                hasPrevPage: ProductList.hasPrevPage,
                hasNextPage: ProductList.hasNextPage,
                prevPage: ProductList.prevPage,
                nextPage: ProductList.nextPage,
                currentPage: ProductList.page,
                totalPages: ProductList.totalPages
            });
    
        } catch (error) {
            console.log("Error obteniendo productos paginados:", error);
            res.status(500).send("Error interno del servidor");
        }
    });
    

module.exports = router;
