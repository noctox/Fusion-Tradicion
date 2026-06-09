// ──--------------- Carta: deslizar hacia arriba al desplazarse ──-------------------

// Seleccionamos todos los elementos que tengan la clase 'carta-item'
const cartaItems = document.querySelectorAll('.carta-item');

// Creamos una función que se encargará de manejar la visibilidad de cada carta
function manejarVisibilidad(entries, observer) {
    // Recorremos cada entrada que el IntersectionObserver detecta
    entries.forEach(function(entry) {
        // Verificamos si el elemento está dentro del viewport (visible en pantalla)
        if (entry.isIntersecting) {
            // Obtenemos el índice del elemento dentro de la lista de cartaItems
            const indiceElemento = Array.from(cartaItems).indexOf(entry.target);

            // Usamos un retraso  de 70ms para que las cartas aparezcan con un efecto escalonado
            const retraso = indiceElemento * 70;

            // Después del retraso, agregamos la clase 'visible' al elemento
            setTimeout(function() {
                entry.target.classList.add('visible');
            }, retraso);

            // Dejamos de observar este elemento para que no se vuelva a activar
            observer.unobserve(entry.target);
        }
    });
}

// ──--------------------- Animación de aparición de cartas ──-----------------------------

// Este bloque se encarga de detectar cuándo cada tarjeta del menú entra en la pantalla.
// Cuando ocurre, se le aplica una animación que la hace deslizar hacia arriba con un efecto escalonado.
// Así, las cartas aparecen de manera progresiva y elegante conforme el usuario se desplaza.

const opcionesObserver = { //creamos una variable para configurar el IntersectionObserver
    threshold: 0.1  // El observer se activará cuando al menos el 10% del elemento sea visible en pantalla
};

// Creamos el IntersectionObserver, que se encargará de vigilar los elementos.
// manejarVisibilidad es la función que se ejecutará cada vez que un elemento observado
// entre o salga del área visible del navegador.
const cartaObserver = new IntersectionObserver(manejarVisibilidad, opcionesObserver);

// Recorremos todos los elementos con la clase 'carta-item' y le decimos al observer
// que los vigile. De esta forma, el observer sabrá cuándo aparecen en pantalla.
cartaItems.forEach(function(item) {
    cartaObserver.observe(item);
});


// ──---------------------- Carousels --------------------------- ──

// Seleccionamos todos los contenedores que tengan el atributo 'data-carousel'.
// Cada uno de estos contenedores será tratado como un carrusel independiente.
document.querySelectorAll('[data-carousel]').forEach(wrapper => {
    // Dentro de cada carrusel, seleccionamos los elementos clave:
    const track = wrapper.querySelector('.products-grid'); // Contenedor de las tarjetas
    const btnPrev = wrapper.querySelector('.btn-prev');    // Botón para retroceder
    const btnNext = wrapper.querySelector('.btn-next');    // Botón para avanzar
    const outer = wrapper.querySelector('.carousel-track-outer'); // Área visible del carrusel

    // Variable que indica la posición actual del carrusel (qué tarjeta está al inicio).
    let current = 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24; // Leer el gap real del CSS

    // Función que calcula cuántas tarjetas pueden mostrarse al mismo tiempo
    // según el ancho disponible del carrusel.
    function visibleCount() {
        const cardW = track.children[0]?.offsetWidth || 220; // Ancho de una tarjeta (por defecto 220px si no se encuentra)
        return Math.max(1, Math.floor((outer.offsetWidth + gap) / (cardW + gap)));
    }

    // Función que calcula el desplazamiento máximo posible del track.
    function maxOffset() {
        return Math.max(0, track.scrollWidth - outer.clientWidth);
    }

    // Función que calcula el índice máximo al que se puede llegar.
    function maxIndex() {
        const cardW = track.children[0]?.offsetWidth || 220;
        const step = cardW + gap;
        return Math.max(0, Math.ceil(maxOffset() / step));
    }

    // Función que actualiza la posición del carrusel en pantalla.
    // Se encarga de mover las tarjetas y habilitar/deshabilitar los botones.
    function update() {
        const cardW = track.children[0]?.offsetWidth || 220; // Ancho de una tarjeta
        const step = cardW + gap; // Paso real entre tarjetas
        const offset = Math.min(current * step, maxOffset());
        track.style.transform = `translateX(-${offset}px)`; // Aplicamos el desplazamiento

        // Deshabilitamos el botón "previo" si estamos en la primera tarjeta
        btnPrev.disabled = current === 0;

        // Deshabilitamos el botón "siguiente" si llegamos al final del carrusel
        btnNext.disabled = current >= maxIndex();
    }

    // Evento para el botón "previo": retrocede una tarjeta si no estamos en la primera.
    btnPrev.addEventListener('click', () => {
        if (current > 0) {
            current--;
            update();
        }
    });

    // Evento para el botón "siguiente": avanza una tarjeta si no estamos en la última.
    btnNext.addEventListener('click', () => {
        if (current < maxIndex()) {
            current++;
            update();
        }
    });

    // Evento que se dispara cuando se cambia el tamaño de la ventana.
    // Ajusta la posición actual para que no se salga del rango permitido.
    window.addEventListener('resize', () => {
        current = Math.min(current, maxIndex());
        update();
    });

    // Llamamos a update() al inicio para que el carrusel se configure correctamente.
    update();
});
