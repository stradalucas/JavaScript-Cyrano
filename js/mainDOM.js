import { productos } from './productos.js';
import { buscarCarrito, removerProductoStorage } from './storage.js';


// Funciones auxiliares del Navbar y el carrito
const abrirMenu = (item) => item.style.cssText = `
  left: 0;
  transition: left 600ms ease;
`;
const cerrarMenu = (item) => item.style.cssText = `
  left: -300px;
  transition: left 900ms ease;
`;
const abrirCarrito = (item) => item.style.cssText = `
  right: 0;
  transition: right 600ms ease;
`;
const cerrarCarrito = (item) => item.style.cssText = `
  right: -300px;
  transition: right 750ms ease;
`;
const mostrarFondo = (item) => item.style.opacity = '0.3';
const ocultarFondo = (item) => item.style.opacity = '0';

// Abrir y cerrar el menu de navagación DOM
const navBars = document.querySelector('.nav_bars');
const fondoNegro = document.querySelector('.fondo-negro');
const bars = document.querySelector('.bars');
const exitMenu = document.querySelector('.nav_bars_exit');

bars.addEventListener('click', e => {
    e.stopPropagation();
    abrirMenu(navBars);
    mostrarFondo(fondoNegro);
    cerrarCarrito(carrito);
});
exitMenu.addEventListener('click', () => {
    cerrarMenu(navBars);
    ocultarFondo(fondoNegro);
});

// Abrir y cerrar el Carrito DOM
const carrito = document.querySelector('.carrito');
const carritoNav = document.querySelector('.carrito_nav');
const exitCarrito = document.querySelector('.exit_carrito');

carritoNav.addEventListener('click', e => {
    e.stopPropagation();
    abrirCarrito(carrito);
    mostrarFondo(fondoNegro);
    cerrarMenu(navBars);
});

exitCarrito.addEventListener('click', () => {
    cerrarCarrito(carrito);
    ocultarFondo(fondoNegro);
});

// Cuando se hace click fuera del Nav o el carrito se cierran
const body = document.querySelector('body');

body.addEventListener('click', e => {
    const noCerrar =
        e.target.closest('.nav_bars') ||
        e.target.closest('.carrito') ||
        e.target.classList.contains('carrito_producto_remover');

    if (noCerrar)
        return;

    const cerrar =
        navBars.style.left == '0px' ||
        carrito.style.right == '0px';

    if (cerrar) {
        cerrarMenu(navBars);
        cerrarCarrito(carrito);
        ocultarFondo(fondoNegro);
    }
});

/*Carrito*/

// Animación para mover hacia arriba notificaciones de agregar o remover productos
const moverNotificaciones = (items) => {
    items.forEach(item => {
        let bottom = item.style.bottom;
        item.style.bottom = `${bottom + 10}rem`;
    });
};

// Notificación cuando se agrega un producto
const notificacionAgregarProducto = (producto) => {
    const notificacionesAgregado = document.querySelectorAll('.notificación_agregado');
    moverNotificaciones(notificacionesAgregado);

    const div = document.createElement('div');
    div.classList.add('notificación_agregado');
    div.innerHTML = `
    <p class="notificacion_titulo">Agregaste <span>${producto.nombre}</span> al carrito</p>
    <p>Precio: <span>$${producto.precio}</span></p>
    `;
    body.append(div);

    setTimeout(() => div.remove(), 4000);
    div.classList.add('slide-in-left');
};

// Notificación cuando se remueve un producto
const notificacionRemoverProductos = (producto) => {
    const notificacionesRemovido = document.querySelectorAll('.notificación_removido');
    moverNotificaciones(notificacionesRemovido);

    const div = document.createElement('div');
    div.classList.add('notificación_removido');
    div.innerHTML = `
    <p class="notificacion_titulo">Removiste <span>${producto.nombre}</span> del carrito</p>
    <p>Precio: <span>$${producto.precio}</span></p>
    `;
    body.append(div);

    setTimeout(() => div.remove(), 4000);
    div.classList.add('slide-in-left');
};

// Agrega los productos al carrito DOM
const carritoProductos = document.querySelector('.carrito_productos_contenedor');

const agregarACarritoDOM = (producto) => {
    carritoProductos.innerHTML += `
  <div class="carrito_producto">
    <div class="carrito_producto_remover" data-id="${producto.id}"></div>
    <a href="#" class="carrito_producto_nombre">
      ${producto.nombre}
      <div href="#" class="carrito_producto_imagen">
        <img src="${producto.url}" alt="${producto.alt}">
      </div>
    </a>
    <p class="carrito_producto_precio">1 x $${producto.precio}.00</p>
  </div>
  `;
};

// Actualiza el precio y número del carrito del Nav ---TODO
const carritoNavPrecio = document.querySelector('.carrito_nav_precio');
const carritoNavContador = document.querySelector('.carrito_nav_contador');

const agregarACarritoNav = (producto) => {
    const precioCarrito = parseInt(carritoNavPrecio.innerText);
    const valorContadorCarrito = parseInt(carritoNavContador.innerText);

    carritoNavPrecio.innerText = precioCarrito + producto.precio;
    carritoNavContador.innerText = valorContadorCarrito + 1;
};

// Actualiza el precio total del carrito DOM
const carritoTotal = document.querySelector('.carrito_total_precio');

const agregarACarritoTotal = (producto) => {
    const valorCarritoTotal = parseInt(carritoTotal.innerText);
    carritoTotal.innerText = valorCarritoTotal + parseInt(producto.precio);
};

// Se ejecutan las funciones relacionadas al carrito

const agregarACarrito = (producto) => {
    agregarACarritoNav(producto);
    agregarACarritoDOM(producto);
    agregarACarritoTotal(producto);
};

// Declaración - Remover un producto del carrito DOM, del local storage
const removerProductoCarrito = (id) => {
    const producto = productos.find((producto) => producto.id == id);

    // Descontar precio total
    const valorCarritoTotal = parseInt(carritoTotal.innerText);
    carritoTotal.innerText = valorCarritoTotal - producto.precio;
    // Descontar valores del nav
    const precioCarrito = parseInt(carritoNavPrecio.innerText);
    const valorContadorCarrito = parseInt(carritoNavContador.innerText);

    carritoNavPrecio.innerText = precioCarrito - producto.precio;
    carritoNavContador.innerText = valorContadorCarrito - 1;
    // Borrar del local storage
    removerProductoStorage(id);

    // Remover producto del carrito DOM
    const btns = [...document.querySelectorAll('.agregar_carrito')];
    const btn = btns.find(btn => btn.dataset.id == id);
    btn.classList.remove('agregado');
};

// Remover un producto del carrito
carritoProductos.addEventListener('click', e => {
    const target = e.target;
    if (!target.classList.contains('carrito_producto_remover')) return;

    const productoId = target.getAttribute("data-id");
    const producto = productos
        .find(producto => producto.id == productoId);

    notificacionRemoverProductos(producto);
    removerProductoCarrito(productoId);
    target.parentElement.remove();
});

// TODO
// Remover todos los productos del carrito
const removerProductosCarrito = () => {
    const carrito = buscarCarrito();
    for (const item of carrito) {
        removerProductoCarrito(item.id);
    }

    while (carritoProductos.lastElementChild) {
        carritoProductos.lastElementChild.remove();
    }
};

// Finalizar la compra de los productos
const iniciarCompra = document.querySelector('.finalizar_compra');

iniciarCompra.addEventListener('click', () => {
    const carrito = buscarCarrito();
    if (carrito.length != 0) {

        removerProductosCarrito();

        swal('Compra Realizada Exitosamente', 'Dentro de las próximas 48hs hábiles le estaremos enviando sus productos. Muchas gracias por confiar en nosotros!', 'success');

        const blue200 = 'rgb(230, 33, 35)';
        const blue400 = 'rgb(230, 33, 35)';
        const swalButton = document.querySelector('.swal-button');

        swalButton.addEventListener('mouseenter', e => {
            e.target.style.backgroundColor = blue200;
        });
        swalButton.addEventListener('mouseleave', e => {
            e.target.style.backgroundColor = blue400;
        });
    };
});

export { notificacionAgregarProducto, agregarACarrito };