// segmentado.js — Grupos de botones de selección única
// Uso: <div data-segmentado="nombre"><button data-valor="x" aria-pressed="false">…
// Emite el evento "cambio" con detail { grupo, valor }.

export function iniciarSegmentados() {
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-segmentado] > button');
    if (!boton) return;
    const grupo = boton.parentElement;
    grupo.querySelectorAll(':scope > button').forEach((hermano) => {
      hermano.setAttribute('aria-pressed', String(hermano === boton));
    });
    boton.dispatchEvent(new CustomEvent('cambio', {
      bubbles: true,
      detail: { grupo: grupo.dataset.segmentado, valor: boton.dataset.valor },
    }));
  });
}
