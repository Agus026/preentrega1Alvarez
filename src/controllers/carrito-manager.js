const { MiError } = require("./product-manager");

const fs = require("fs").promises;

class CarritoManager {

    constructor(pathCarrito, pathProducto) {
        this.carritos = [];
        this.pathCarrito = pathCarrito;
        this.pathProducto = pathProducto

    }

    async leerArchivo(path) {
        const respuesta = await fs.readFile(path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos, path) {
        await fs.writeFile(path, JSON.stringify(arrayProductos, null, 2));
    }

    async getNewCart() {
        this.carritos = await this.leerArchivo(this.pathCarrito)
        const carritoNuevo = new Carrito(this.carritos.length + 1)

        this.carritos.push(carritoNuevo);
        await this.guardarArchivo(this.carritos, this.pathCarrito);
        return carritoNuevo
    }
    async listarProductos(id) {
        this.carritos = await this.leerArchivo(this.pathCarrito);
        const buscado = this.carritos.find(item => item.id === id);

        if (!buscado) {
            throw new MiError("Not found");
        }
        return buscado.products
    }
    async agregarAlCarrito(cid, pid) {
        
       this.carritos = await this.leerArchivo(this.pathCarrito)
        const carrito = this.carritos.find(c => c.id === cid);

        let productos = await this.leerArchivo(this.pathProducto)
        const producto = productos.find(p => p.id === pid)
        if (!carrito) {
            throw new MiError("Carrito no encontrado")
        }           

        if (!producto) {
            throw new MiError("Producto no encontrado")
        }

        const productInCart = carrito.products.find(p => p.product === pid);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            carrito.products.push({ product: pid, quantity: 1 });
        }
        await this.guardarArchivo(this.carritos, this.pathCarrito);
        
            
    }
}

class Carrito {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

}

module.exports = CarritoManager