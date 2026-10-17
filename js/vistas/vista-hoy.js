// vista-hoy.js — Hoy: fecha, Agenda (con marca Ahora), Fijadas y resumen de notas
import { estado } from '../datos/estado.js';
import { estaAhora, eventosDelDia } from '../nucleo/nucleo.js';
import { agruparNotas, textoResumen } from '../nucleo/notas.js';
import { formatoFechaLarga, indiceDia, lunesDeSemana, minutosDelDia, sumarDias } from '../nucleo/tiempo.js';
import { tarjetaEvento, tarjetaNotaFijada } from '../componentes/tarjetas.js';
import { dibujarNotas } from './vista-notas.js';

const $ = (id) => document.getElementById(id);

export function dibujarHoy() {
  const ahora = new Date();
  $('fecha-hoy').textContent = formatoFechaLarga(ahora);

  // Fila L–D: queda marcado el día elegido
  $('dias-hoy').querySelectorAll(':scope > button').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(Number(boton.dataset.valor) === estado.diaVisto));
  });

  // Fijadas (arriba, sea cual sea el día elegido)
  const { fijadas } = agruparNotas(estado.notas, ahora);
  $('fijadas').hidden = !fijadas.length;
  $('lista-fijadas').replaceChildren(...fijadas.map((nota) => tarjetaNotaFijada(nota, ahora)));

  // Resumen de notas por vencer
  const resumen = textoResumen(estado.notas, ahora);
  $('resumen-notas').hidden = !resumen;
  $('texto-resumen').textContent = resumen;

  // Eventos del día elegido
  const fecha = sumarDias(lunesDeSemana(ahora), estado.diaVisto);
  const esHoy = estado.diaVisto === indiceDia(ahora);
  const minutos = minutosDelDia(ahora);
  const eventos = eventosDelDia(estado.eventos, fecha);
  $('lista-agenda').replaceChildren(...eventos.map((e) => tarjetaEvento(e, { esAhora: esHoy && estaAhora(e, minutos) })));
  $('agenda-vacia').hidden = eventos.length > 0;

  $('contador-notas').textContent = String(estado.notas.length);
  dibujarNotas();
}
