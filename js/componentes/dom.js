// dom.js — Creación segura de elementos (el texto nunca se inserta como HTML)

/** crear('button', { class: 'x', 'aria-label': 'Y' }, 'Texto', otroElemento) */
export function crear(etiqueta, atributos = {}, ...hijos) {
  const elemento = document.createElement(etiqueta);
  for (const [nombre, valor] of Object.entries(atributos)) {
    if (nombre === 'class') elemento.className = valor;
    else elemento.setAttribute(nombre, valor);
  }
  elemento.append(...hijos); // los textos se añaden como texto
  return elemento;
}
