const fs = require("fs").promises;
function overwriteProperties(objA, objB) {
    Object.assign(objB, objA);
    return objB;
}

class ProductManager {

    static ultId = 0;


    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock, thumbnails, category }) {


        if (!title || !description || !price || !img || !code || !stock || !category) {
           throw new MiError("Todos los campos son obligatorios");
            
        }

        this.products = await this.leerArchivo()

        if (this.products.some(item => item.code === code)) {
            throw new MiError("El codigo debe ser unico");
            
        }


        const nuevoProducto = {
            id: this.products.length + 1,
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || [],
        }

        this.products.push(nuevoProducto);

        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos;
    }


    async getProductById(id) {

        this.products = await this.leerArchivo();
        const buscado = this.products.find(item => item.id === id);

        if (!buscado) {
            throw new MiError("Not found");
        } else {
            return buscado;
        }
    }


    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }

    async actualizarProducto(id, productoB) {
        const productoA = await this.getProductById(id)
        const resultado = overwriteProperties(productoB, productoA);

        await this.guardarArchivo(this.products);

        console.log(resultado)
    }
    async eliminarProducto(pid) {
        this.products = await this.leerArchivo()
        const productIndex = this.products.findIndex(p => p.id === pid);

        if (productIndex === -1) {

            return "Producto eliminado correctamente"
        }
        
        this.products.splice(productIndex, 1);
        await this.guardarArchivo(this.products)
        return "Producto eliminado correctamente";

    }

}

class MiError extends Error {

}
module.exports = {ProductManager, MiError}

