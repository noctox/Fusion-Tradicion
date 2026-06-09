const cards = document.querySelectorAll('.product-card');
const overlay = document.getElementById('overlay');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Clonar la tarjeta para mostrarla centrada
    const clone = card.cloneNode(true);
    clone.classList.add('expanded');
    overlay.innerHTML = '';
    overlay.appendChild(clone);
    overlay.style.display = 'flex';
  });
});

// Cerrar al hacer clic fuera
overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
});
