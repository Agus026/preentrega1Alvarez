const express = require("express");
const router = express.Router();
const { ProductManager } = require("../controllers/product-manager.js");
const productModel = require("../Models/product.model.js");
const mongoose = require("mongoose");

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://agustinalvarez:Agusdb@cluster0.r0mj1.mongodb.net/Proyectofinal?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
    }
}

connectToDatabase();

// Ruta de registro
router.get("/register", (req, res) => {
    if (req.session) {
        return res.redirect("/perfil");
    }
    res.render("registro");
});

// Ruta de login
router.get("/login", (req, res) => {
    if (req.session) {
        return res.redirect("/perfil");
    }
    res.render("login");
});

// Ruta de perfil
router.get("/perfil", (req, res) => {
    if (!req.session) {
        return res.redirect("/login");
    }
    res.render("perfil", { user: req.session.user });
});

// Ruta principal para productos con paginación
router.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let query = req.query.query ? { $text: { $search: req.query.query } } : {};

    try {
        const ProductList = await productModel.paginate(query, { limit, page });

        const productFinal = ProductList.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return { ...rest, id: _id };
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
        console.error("Error obteniendo productos paginados:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;
