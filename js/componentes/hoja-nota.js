// hoja-nota.js — Hoja de nota: crear, editar y borrar
import { estado, guardarNotasEnEstado } from '../datos/estado.js';
import { aTexto, deTexto, soloFecha } from '../nucleo/tiempo.js';
import { FIN_DIA } from '../nucleo/nucleo.js';
import { MAX_NOTAS, normalizarNota, puedeFijar } from '../nucleo/notas.js';
import { abrirDialogo } from './dialogo.js';
import { mostrarAlerta } from './alerta.js';
import { ruedaDe } from './rueda.js';

const $ = (id) => document.getElementById(id);
let editando = null;
let horaLimite = FIN_DIA; // hora que se pone en la rueda cuando se muestra el bloque de límite

function marcarGrupo(id, valor) {
  $(id).querySelectorAll(':scope > button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === String(valor))));
}
const leerGrupo = (id) => $(id).querySelector(':scope > [aria-pressed="true"]')?.dataset.valor;
function fijarInterruptor(id, activo) {
  const boton = $(id);
  boton.setAttribute('aria-checked', String(activo));
  if (boton.dataset.revela) $(boton.dataset.revela).hidden = !activo;
}
const interruptorActivo = (id) => $(id).getAttribute('aria-checked') === 'true';

/**
 * abrirHojaNota({ id }) edita una nota.
 * abrirHojaNota({ fecha }) crea una nueva proponiendo esa fecha límite.
 */
export function abrirHojaNota(opciones = {}) {
  editando = opciones.id ? estado.notas.find((n) => n.id === opciones.id) || null : null;
  const limite = editando ? editando.limite : (opciones.fecha ? { fecha: aTexto(opciones.fecha), hora: FIN_DIA } : null);
  const aviso = editando ? editando.aviso : { activo: false, antes: 0 };

  $('titulo-hoja-nota').textContent = editando ? 'Editar nota' : 'Nueva nota';
  $('nota-titulo').value = editando ? editando.titulo : '';
  $('nota-texto').value = editando ? editando.texto : '';
  fijarInterruptor('interruptor-limite', Boolean(limite));
  $('nota-fecha').value = limite ? limite.fecha : aTexto(soloFecha(new Date()));
  fijarInterruptor('interruptor-aviso-nota', aviso.activo);
  marcarGrupo('antelacion-nota', aviso.antes);
  fijarInterruptor('interruptor-fijar', Boolean(editando?.fijada));
  $('nota-borrar').hidden = !editando;

  horaLimite = limite?.hora ?? FIN_DIA;
  abrirDialogo('hoja-nota');
  ruedaDe('rueda-nota-limite').fijar(horaLimite); // solo se coloca si el bloque está visible
}

function guardar() {
  if (!editando && estado.notas.length >= MAX_NOTAS) {
    mostrarAlerta({ titulo: 'Límite de notas', texto: `Se pueden guardar hasta ${MAX_NOTAS} notas. Borra alguna para añadir otra.` });
    return;
  }
  const fijar = interruptorActivo('interruptor-fijar');
  if (fijar && !puedeFijar(estado.notas, editando?.id)) {
    fijarInterruptor('interruptor-fijar', false);
    mostrarAlerta({ titulo: 'Máximo de notas fijadas', texto: 'Ya hay 3 notas fijadas. Suelta una antes de fijar otra.' });
    return;
  }
  const conLimite = interruptorActivo('interruptor-limite') && deTexto($('nota-fecha').value);
  const activo = interruptorActivo('interruptor-aviso-nota');
  const nota = normalizarNota({
    id: editando?.id,
    titulo: $('nota-titulo').value,
    texto: $('nota-texto').value,
    limite: conLimite ? { fecha: $('nota-fecha').value, hora: ruedaDe('rueda-nota-limite').leer() } : null,
    fijada: fijar,
    aviso: { activo, antes: Number(leerGrupo('antelacion-nota')), configurado: activo || editando?.aviso.configurado },
  }, editando);
  guardarNotasEnEstado(editando
    ? estado.notas.map((n) => (n.id === editando.id ? nota : n))
    : [...estado.notas, nota]);
  $('hoja-nota').close();
}

function borrar() {
  if (!editando) return;
  guardarNotasEnEstado(estado.notas.filter((n) => n.id !== editando.id));
  $('hoja-nota').close();
}

export function iniciarHojaNota() {
  // La rueda no puede colocarse mientras está oculta: se coloca al activar la fecha límite
  $('interruptor-limite').addEventListener('cambio', (evento) => {
    if (evento.detail.activo) ruedaDe('rueda-nota-limite').fijar(horaLimite);
  });
  $('nota-guardar').addEventListener('click', guardar);
  $('nota-borrar').addEventListener('click', borrar);
  $('nota-titulo').addEventListener('keydown', (e) => { if (e.key === 'Enter') guardar(); });
}
