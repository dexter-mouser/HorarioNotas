// abanico.js — Botón + con las opciones "Nueva nota" y "Nuevo evento"

export function iniciarAbanico() {
  const boton = document.getElementById('boton-mas');
  const menu = document.getElementById('abanico');
  const velo = document.getElementById('velo');

  function cerrar() {
    menu.hidden = true;
    velo.classList.remove('visible');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Añadir nota o evento');
  }

  function abrir() {
    menu.hidden = false;
    velo.classList.add('visible');
    boton.setAttribute('aria-expanded', 'true');
    boton.setAttribute('aria-label', 'Cerrar menú');
    menu.querySelector('button')?.focus();
  }

  boton.addEventListener('click', () => (menu.hidden ? abrir() : cerrar()));
  velo.addEventListener('click', cerrar);
  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('button')) cerrar(); // la apertura de la hoja la hace app.js
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !menu.hidden) {
      cerrar();
      boton.focus();
    }
  });
}
