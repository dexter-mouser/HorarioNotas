// fondos.js — Lista de fondos y cómo se aplican (solo imagen)
import { CLAVES, leerTexto, guardarTexto } from '../datos/almacenamiento.js';

// Estándar = color liso del tema. Cada fondo con imagen añadido después
// tiene su archivo css/fondos/<id>.css (ver ARQUITECTURA.md).
export const FONDOS = [
  { id: 'estandar', nombre: 'Estándar' },
];

export function obtenerFondo() {
  const id = leerTexto(CLAVES.fondo, 'estandar');
  return FONDOS.some((f) => f.id === id) ? id : 'estandar';
}

export function fijarFondo(id) {
  if (!FONDOS.some((f) => f.id === id)) return;
  guardarTexto(CLAVES.fondo, id);
  if (id === 'estandar') delete document.documentElement.dataset.fondo;
  else document.documentElement.dataset.fondo = id;
}

export function iniciarFondo() {
  fijarFondo(obtenerFondo());
}
