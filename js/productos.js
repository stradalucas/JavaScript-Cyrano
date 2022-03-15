import { agregarACarritoStorage } from './storage.js';
import { notificacionAgregarProducto, agregarACarrito } from './mainDOM.js';

let productos = [];

/*Constructor*/

class Producto {
    constructor(id, nombre, precio, url, alt) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.url = url;
        this.alt = alt;
    }
}

/*Funciones*/

// Declaración - Agrega los productos a un array
const agregarStock = (items) => {
    productos = [];

    let image = './images/';

    items.forEach(item => {
        const producto = new Producto(
            item.id,
            item.nombre,
            item.precio,
            image + item.imagen.url,
            image + item.imagen.alt
        );
        productos.push(producto);
    });
};

// Declaración - Card del porducto
const contenedor = document.querySelector('.productos_contenedor');

const agregarProductosDOM = () => {

    productos.forEach(producto => {
        const div = document.createElement('div');

        div.classList.add('producto_card');
        div.innerHTML = `
      
        <a href="#" class="producto_imagen">
          <img src="${producto.url}" alt="${producto.alt}">
        </a>

        <div class="producto_descripción">
          <a href="#"><h3 class="producto_nombre">${producto.nombre}</h3></a>
          <p>$<span class="producto_precio">${producto.precio}</span>.00</p>
        </div>
        
        <button class="agregar_carrito" data-id="${producto.id}">AGREGAR AL CARRITO</button>
      `;
        contenedor.append(div);
        return;
    });
};

// Declaración - Agrega lo guardado en el local storage y agrega los event listeners a los productos
const prepararProductos = () => {
    agregarProductosDOM();

    const agregarCarrito = document.querySelectorAll('.agregar_carrito');

    agregarCarrito.forEach((boton) => {
        boton.addEventListener('click', e => {
            const productoId = e.target.getAttribute("data-id");
            const producto = productos.find((producto) => producto.id == productoId);

            notificacionAgregarProducto(producto);
            agregarACarritoStorage(producto);
            agregarACarrito(producto);
        });
    });
};

// Vincular la base de datos.
const getAjax = async(url) => {
    const response = await fetch(url);
    return await response.json();
};

const getProductos = async() => {
    // if (!contenedor) return;
    let result = await getAjax('./productos.json');
    // agregarStock(result, productos);
    agregarStock(result);
    prepararProductos(productos);
};

// Ejecución 
getProductos();

export { prepararProductos, productos };