// tema.js — Modo claro/oscuro/sistema y color de acento
import { calcularVariablesAcento, esHexValido } from '../nucleo/color.js';
import { CLAVES, leerTexto, guardarTexto, guardarJSON } from '../datos/almacenamiento.js';

export const ACENTOS = [
  { id: 'coral', nombre: 'Coral', hex: '#ff6b4a' },
  { id: 'ambar', nombre: 'Ámbar', hex: '#ffb547' },
  { id: 'jade', nombre: 'Jade', hex: '#34d399' },
  { id: 'indigo', nombre: 'Índigo', hex: '#6b8cff' },
  { id: 'lavanda', nombre: 'Lavanda', hex: '#c084fc' },
];
export const MODOS = [
  { id: 'sistema', nombre: 'Sistema' },
  { id: 'claro', nombre: 'Claro' },
  { id: 'oscuro', nombre: 'Oscuro' },
];

const raiz = document.documentElement;
const consultaOscuro = window.matchMedia('(prefers-color-scheme: dark)');

function avisarCambio() {
  document.dispatchEvent(new CustomEvent('tema:cambio'));
}

/** Modo elegido por la persona: 'sistema', 'claro' u 'oscuro'. */
export function obtenerModo() {
  const modo = leerTexto(CLAVES.modo, 'sistema');
  return MODOS.some((m) => m.id === modo) ? modo : 'sistema';
}

/** Modo que se está viendo realmente (resuelve 'sistema'). */
export function modoEfectivo() {
  const modo = obtenerModo();
  if (modo !== 'sistema') return modo;
  return consultaOscuro.matches ? 'oscuro' : 'claro';
}

/** Cambia y guarda el modo. */
export function fijarModo(modo) {
  if (!MODOS.some((m) => m.id === modo)) return;
  guardarTexto(CLAVES.modo, modo);
  if (modo === 'sistema') delete raiz.dataset.tema;
  else raiz.dataset.tema = modo;
  avisarCambio();
}

/** Alterna entre claro y oscuro (botón de la pantalla Hoy). */
export function alternarModo() {
  fijarModo(modoEfectivo() === 'oscuro' ? 'claro' : 'oscuro');
}

/** Color de acento actual con su nombre. */
export function obtenerAcento() {
  const hex = leerTexto(CLAVES.acento, ACENTOS[0].hex).toLowerCase();
  const conocido = ACENTOS.find((a) => a.hex === hex);
  return { hex, nombre: conocido ? conocido.nombre : 'Personalizado', predefinido: Boolean(conocido) };
}

/** Calcula, aplica y guarda un acento (contraste dinámico). */
export function fijarAcento(hex) {
  if (!esHexValido(hex)) return;
  const variables = calcularVariablesAcento(hex);
  for (const [nombre, valor] of Object.entries(variables)) raiz.style.setProperty(nombre, valor);
  guardarTexto(CLAVES.acento, hex.toLowerCase());
  guardarJSON(CLAVES.acentoVariables, variables);
  avisarCambio();
}

/** Arranque: aplica lo guardado y escucha cambios del sistema. */
export function iniciarTema() {
  const modo = obtenerModo();
  if (modo !== 'sistema') raiz.dataset.tema = modo;
  fijarAcento(obtenerAcento().hex);
  consultaOscuro.addEventListener('change', avisarCambio);
}
