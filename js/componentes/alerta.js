// alerta.js — Aviso emergente (título, texto, lista opcional y botones)
import { crear } from './dom.js';
import { abrirDialogo } from './dialogo.js';

/**
 * mostrarAlerta({ titulo, texto, lineas, botones: [{ texto, accion }] })
 * Sin botones se muestra "Entendido". El último botón es el principal.
 */
export function mostrarAlerta({ titulo, texto = '', lineas = [], botones = [{ texto: 'Entendido' }] }) {
  const dialogo = document.getElementById('alerta');
  document.getElementById('alerta-titulo').textContent = titulo;
  const parrafo = document.getElementById('alerta-texto');
  parrafo.textContent = texto;
  parrafo.hidden = !texto;
  const lista = document.getElementById('alerta-lista');
  lista.replaceChildren(...lineas.map((linea) => crear('li', {}, linea)));
  lista.hidden = !lineas.length;

  const acciones = document.getElementById('alerta-acciones');
  acciones.replaceChildren(...botones.map((boton, i) => {
    const elemento = crear('button', { type: 'button', class: i === botones.length - 1 ? 'boton-principal' : 'boton-borde' }, boton.texto);
    elemento.addEventListener('click', () => {
      dialogo.close();
      if (boton.accion) boton.accion();
    });
    return elemento;
  }));
  abrirDialogo('alerta');
  acciones.lastElementChild.focus();
}
