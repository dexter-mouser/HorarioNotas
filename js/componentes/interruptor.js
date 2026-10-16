// interruptor.js — Interruptores accesibles (role="switch")
// data-revela="id" muestra u oculta el elemento indicado.

export function iniciarInterruptores() {
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.interruptor');
    if (!boton) return;
    const activo = boton.getAttribute('aria-checked') !== 'true';
    boton.setAttribute('aria-checked', String(activo));
    if (boton.dataset.revela) {
      const destino = document.getElementById(boton.dataset.revela);
      if (destino) destino.hidden = !activo;
    }
    boton.dispatchEvent(new CustomEvent('cambio', { bubbles: true, detail: { activo } }));
  });
}
