// rueda.js — Selector de hora en rueda (horas 00–23, minutos de 5 en 5)
import { crear } from './dom.js';

const ALTO_ITEM = 40;   // debe coincidir con .rueda-item en style.css
const ESPERA_MS = 130;  // tiempo sin moverse para dar por terminado el giro

function crearRueda(cantidad, paso, etiqueta) {
  const lista = crear('div', { class: 'rueda', tabindex: '0', role: 'listbox', 'aria-label': etiqueta });
  for (let i = 0; i < cantidad; i++) {
    lista.append(crear('div', { class: 'rueda-item', role: 'option' }, String(i * paso).padStart(2, '0')));
  }
  const caja = crear('div', { class: 'rueda-caja' }, lista, crear('div', { class: 'resaltado', 'aria-hidden': 'true' }));
  return { caja, lista };
}

/** Crea un selector con letra (I/F), horas y minutos. */
export function crearSelectorHora({ letra, etiqueta, hora = 0, minuto = 0 }) {
  const horas = crearRueda(24, 1, `${etiqueta}: horas`);
  const minutos = crearRueda(12, 5, `${etiqueta}: minutos`);
  const elemento = crear('div', { class: 'selector-hora', role: 'group', 'aria-label': etiqueta },
    crear('span', { class: 'letra-caja', 'aria-hidden': 'true' }, letra),
    horas.caja,
    crear('span', { class: 'separador-hora', 'aria-hidden': 'true' }, ':'),
    minutos.caja);

  const oyentes = [];
  let temporizador = null;
  const leer = () => Math.round(horas.lista.scrollTop / ALTO_ITEM) * 60 + Math.round(minutos.lista.scrollTop / ALTO_ITEM) * 5;
  const alTerminarGiro = () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => oyentes.forEach((fn) => fn(leer())), ESPERA_MS);
  };
  horas.lista.addEventListener('scroll', alTerminarGiro, { passive: true });
  minutos.lista.addEventListener('scroll', alTerminarGiro, { passive: true });

  const api = {
    elemento,
    inicial: hora * 60 + minuto,
    leer,
    /** Coloca la rueda en un valor (minutos desde las 00:00). */
    fijar(total) {
      horas.lista.scrollTop = Math.floor(total / 60) * ALTO_ITEM;
      minutos.lista.scrollTop = Math.round((total % 60) / 5) * ALTO_ITEM;
    },
    /** Registra una función que recibe el valor cuando termina un giro. */
    alCambiar(funcion) {
      oyentes.push(funcion);
    },
  };
  elemento.api = api;
  return api;
}

/** Monta los selectores en cada <div data-rueda data-letra data-etiqueta data-hora data-minuto>. */
export function montarRuedas(raiz = document) {
  raiz.querySelectorAll('[data-rueda]').forEach((sitio) => {
    const api = crearSelectorHora({
      letra: sitio.dataset.letra,
      etiqueta: sitio.dataset.etiqueta,
      hora: Number(sitio.dataset.hora || 0),
      minuto: Number(sitio.dataset.minuto || 0),
    });
    sitio.append(api.elemento);
  });
}

/** API del selector montado en el elemento con ese id. */
export function ruedaDe(id) {
  return document.getElementById(id).querySelector('.selector-hora').api;
}
