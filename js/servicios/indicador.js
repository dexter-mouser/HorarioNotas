// indicador.js — Marca del día actual en Hoy (estrella, rombo o corazón)
import { CLAVES, leerTexto, guardarTexto } from '../datos/almacenamiento.js';
import { icono } from '../componentes/iconos.js';
import { NOMBRES_DIA, indiceDia } from '../nucleo/tiempo.js';

export const INDICADORES = [
  { id: 'estrella', nombre: 'Estrella' },
  { id: 'rombo', nombre: 'Rombo' },
  { id: 'corazon', nombre: 'Corazón' },
];

export function obtenerIndicador() {
  const id = leerTexto(CLAVES.indicador, 'estrella');
  return INDICADORES.some((i) => i.id === id) ? id : 'estrella';
}

/** Dibuja el indicador bajo la letra del día actual y lo anuncia en su botón. */
export function aplicarIndicador() {
  const hoy = indiceDia(new Date());
  const id = obtenerIndicador();
  document.querySelectorAll('.marca-dia').forEach((celda) => {
    const esHoy = Number(celda.dataset.dia) === hoy;
    celda.replaceChildren(...(esHoy ? [icono(id, 'Día actual')] : []));
    const boton = document.querySelector(`[data-segmentado="dia-hoy"] > [data-valor="${celda.dataset.dia}"]`);
    boton?.setAttribute('aria-label', esHoy ? `${NOMBRES_DIA[celda.dataset.dia]}, hoy` : NOMBRES_DIA[celda.dataset.dia]);
  });
}

/** Cambia y guarda la forma del indicador. */
export function fijarIndicador(id) {
  if (!INDICADORES.some((i) => i.id === id)) return;
  guardarTexto(CLAVES.indicador, id);
  aplicarIndicador();
}
