const socket = io();

socket.on("productos", (data) => {
    console.log(data)
    renderProductos(data)
});


const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `<p>${item.title}</p>
                          <p>${item._id}</p>
                          <p>${item.description}</p>
                          <p>${item.price}</p>
                          <button> Eliminar </button>
                          `
        contenedorProductos.appendChild(card)

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        })
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id)
};