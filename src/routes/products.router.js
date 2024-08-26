const express = require("express");
const router = express.Router();
const { MiError, ProductManager } = require("../controllers/product-manager");
const manager = new ProductManager();

router.use(express.json());

router.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
    let query = req.query.query ? { $or: [{ category: req.query.query }, { status: req.query.query === 'true' }] } : {};
    
    try {
        const options = {
            limit: limit,
            page: page,
            sort: sort !== null ? { price: sort } : {}
        };
        
        const ProductList = await manager.getProductsPaginated(query, options);

        const response = {
            status: "success",
            payload: ProductList.docs,
            totalPages: ProductList.totalPages,
            prevPage: ProductList.hasPrevPage ? ProductList.prevPage : null,
            nextPage: ProductList.hasNextPage ? ProductList.nextPage : null,
            page: ProductList.page,
            hasPrevPage: ProductList.hasPrevPage,
            hasNextPage: ProductList.hasNextPage,
            prevLink: ProductList.hasPrevPage ? `/api/products?limit=${limit}&page=${ProductList.prevPage}&sort=${req.query.sort || ''}&query=${req.query.query || ''}` : null,
            nextLink: ProductList.hasNextPage ? `/api/products?limit=${limit}&page=${ProductList.nextPage}&sort=${req.query.sort || ''}&query=${req.query.query || ''}` : null
        };

        res.status(200).send(response);

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", message: "Error del servidor" });
    }
});

module.exports = router;

