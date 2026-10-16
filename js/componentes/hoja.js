// hoja.js — Hoja de evento: campo Fecha de "Por una vez" y su sincronía con el día.
// Los eventos de una sola vez pueden ir en la semana actual o en cualquier semana
// futura; no se permiten semanas pasadas (mínimo = lunes de la semana actual).
import { aTexto, deTexto, indiceDia, lunesDeSemana, sumarDias } from '../nucleo/tiempo.js';

const campoFecha = () => document.getElementById('fecha-evento');
const botonesDia = () => document.querySelectorAll('[data-segmentado="dia-evento"] > button');
const botonesRepeticion = () => document.querySelectorAll('[data-segmentado="repeticion"] > button');

/** Marca en la fila L–X la letra del día de la fecha. */
function marcarDia(fecha) {
  botonesDia().forEach((boton) => boton.setAttribute('aria-pressed', String(Number(boton.dataset.valor) === indiceDia(fecha))));
}

function esUnaVez() {
  return document.querySelector('[data-segmentado="repeticion"] [aria-pressed="true"]')?.dataset.valor === 'una-vez';
}

/** Deja la hoja como un evento nuevo: indefinido y con la fecha de hoy. */
export function reiniciarHojaEvento() {
  const hoy = new Date();
  const campo = campoFecha();
  campo.min = aTexto(lunesDeSemana(hoy));
  campo.value = aTexto(hoy);
  botonesRepeticion().forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === 'indefinido')));
  document.getElementById('fecha-una-vez').hidden = true;
  marcarDia(hoy);
}

/** Conecta el selector de fecha con la fila de días. */
export function iniciarHojaEvento() {
  // Al elegir una fecha, se marca su día de la semana
  campoFecha().addEventListener('change', (evento) => {
    let fecha = deTexto(evento.target.value);
    const minimo = deTexto(evento.target.min);
    if (!fecha || (minimo && fecha < minimo)) { // vacía o de una semana pasada
      fecha = minimo || new Date();
      evento.target.value = aTexto(fecha);
    }
    marcarDia(fecha);
  });

  // Al elegir un día en "Por una vez", la fecha se mueve a ese día de su semana
  document.addEventListener('cambio', (evento) => {
    if (evento.detail?.grupo !== 'dia-evento' || !esUnaVez()) return;
    const base = deTexto(campoFecha().value) || new Date();
    campoFecha().value = aTexto(sumarDias(lunesDeSemana(base), Number(evento.detail.valor)));
  });
}
