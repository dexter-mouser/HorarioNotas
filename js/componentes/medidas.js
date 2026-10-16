// medidas.js — Aplica posiciones en porcentaje (la política de seguridad
// no permite atributos style en el HTML, pero sí asignarlos desde JavaScript).
// Uso: <i data-izq="25" data-ancho="10"></i>

export function aplicarMedidas(raiz = document) {
  raiz.querySelectorAll('[data-izq]').forEach((el) => {
    el.style.left = `${el.dataset.izq}%`;
    if (el.dataset.ancho) el.style.width = `${el.dataset.ancho}%`;
  });
}
