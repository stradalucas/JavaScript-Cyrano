import { agregarACarrito } from './mainDOM.js';

let carritoArray = [];

const buscarCarrito = () => JSON.parse(localStorage.getItem('carrito'));

// Agrega los productos al carrito del local storage
const agregarACarritoStorage = (producto) => {
    carritoArray.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carritoArray));
};
// Actualiza el carrito con el carrito del local storage
const actualizarCarrito = () => {
    const carritoStorege = buscarCarrito();
    if (carritoStorege != null) {
        carritoArray = [...carritoStorege];
        carritoStorege.forEach(producto => {
            agregarACarrito(producto);
        });
    }
};

const removerProductoStorage = (id) => {
    carritoArray = carritoArray.filter((producto) => producto.id != id);
    localStorage.setItem('carrito', JSON.stringify(carritoArray));
};

export { buscarCarrito, agregarACarritoStorage, actualizarCarrito, removerProductoStorage };