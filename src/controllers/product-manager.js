const mongoose = require("mongoose");
const productModel = require("../Models/product.model.js");

// Conexión a la base de datos
async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://agustinalvarez:Agusdb@cluster0.r0mj1.mongodb.net/Proyectofinal?retryWrites=true&w=majority&appName=Cluster0");
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
        process.exit(1);
    }
}

connectToDatabase();

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, thumbnails, category }) {
        if (!title || !description || !price || !img || !code || !stock || !category) {
            throw new MiError("Todos los campos son obligatorios");
        }

        const existingProduct = await productModel.findOne({ code });
        if (existingProduct) {
            throw new MiError("El código debe ser único");
        }

        const nuevoProducto = new productModel({
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || [],
        });

        await nuevoProducto.save();
    }

    async getProducts() {
        return await productModel.find();
    }

    async getProductById(id) {
        const producto = await productModel.findById(id);
        if (!producto) {
            throw new MiError("Producto no encontrado");
        }
        return producto;
    }
    async getProductsPaginated(query, options) {
        return await productModel.paginate(query, options);
    }
    
    async actualizarProducto(id, productoB) {
        const productoA = await this.getProductById(id);
        Object.assign(productoA, productoB);
        await productoA.save();
        return productoA;
    }

    async eliminarProducto(pid) {
        const producto = await productModel.findByIdAndDelete(pid);
        if (!producto) {
            throw new MiError("Producto no encontrado");
        }
        return "Producto eliminado correctamente";
        
    }
}

class MiError extends Error {}

module.exports = { ProductManager, MiError };
