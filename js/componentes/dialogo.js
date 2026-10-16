// dialogo.js — Comportamiento común de las ventanas (<dialog> modal)
// El navegador gestiona el foco, Esc y el regreso del foco al cerrar.

export function abrirDialogo(id) {
  const dialogo = document.getElementById(id);
  if (dialogo && !dialogo.open) dialogo.showModal();
  return dialogo;
}

export function iniciarDialogos() {
  document.addEventListener('click', (evento) => {
    const cierre = evento.target.closest('[data-cerrar]');
    if (cierre) {
      cierre.closest('dialog')?.close();
      return;
    }
    // Tocar fuera (el fondo del diálogo) lo cierra
    if (evento.target instanceof HTMLDialogElement && evento.target.open) evento.target.close();
  });
}
