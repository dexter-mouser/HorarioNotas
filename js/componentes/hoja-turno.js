// hoja-turno.js — Hoja de turno: crear, editar y borrar (hasta 12 turnos)
import { estado, guardarTurnosEnEstado } from '../datos/estado.js';
import { ajustarHoras } from '../nucleo/nucleo.js';
import { MAX_TURNOS, normalizarTurno } from '../nucleo/turnos.js';
import { abrirDialogo } from './dialogo.js';
import { mostrarAlerta } from './alerta.js';
import { ruedaDe } from './rueda.js';

const $ = (id) => document.getElementById(id);
let editando = null;

/** abrirHojaTurno({ id }) edita un turno; sin id crea uno nuevo. */
export function abrirHojaTurno(opciones = {}) {
  editando = opciones.id ? estado.turnos.find((t) => t.id === opciones.id) || null : null;
  if (!editando && estado.turnos.length >= MAX_TURNOS) {
    mostrarAlerta({ titulo: 'Límite de turnos', texto: `Se pueden guardar hasta ${MAX_TURNOS} turnos.` });
    return;
  }
  $('titulo-hoja-turno').textContent = editando ? 'Editar turno' : 'Nuevo turno';
  $('turno-nombre').value = editando ? editando.nombre : '';
  $('turno-borrar').hidden = !editando;
  abrirDialogo('hoja-turno');
  ruedaDe('rueda-turno-inicio').fijar(editando ? editando.inicio : 360);
  ruedaDe('rueda-turno-fin').fijar(editando ? editando.fin : 840);
}

function guardar() {
  const turno = normalizarTurno({
    id: editando?.id,
    nombre: $('turno-nombre').value,
    inicio: ruedaDe('rueda-turno-inicio').leer(),
    fin: ruedaDe('rueda-turno-fin').leer(),
  });
  guardarTurnosEnEstado(editando
    ? estado.turnos.map((t) => (t.id === editando.id ? turno : t))
    : [...estado.turnos, turno]);
  $('hoja-turno').close();
}

function borrar() {
  if (!editando) return;
  guardarTurnosEnEstado(estado.turnos.filter((t) => t.id !== editando.id));
  $('hoja-turno').close();
}

export function iniciarHojaTurno() {
  const inicio = ruedaDe('rueda-turno-inicio');
  const fin = ruedaDe('rueda-turno-fin');
  inicio.alCambiar((valor) => {
    const r = ajustarHoras(valor, fin.leer(), 'inicio');
    if (r.inicio !== valor) inicio.fijar(r.inicio);
    if (r.fin !== fin.leer()) fin.fijar(r.fin);
  });
  fin.alCambiar((valor) => {
    const r = ajustarHoras(inicio.leer(), valor, 'fin');
    if (r.fin !== valor) fin.fijar(r.fin);
  });
  $('turno-guardar').addEventListener('click', guardar);
  $('turno-borrar').addEventListener('click', borrar);
  $('turno-nombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') guardar(); });
}
