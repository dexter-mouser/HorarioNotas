// hoja.js — Hoja de evento: crear, editar y borrar
// Los eventos "Por una vez" pueden ir en la semana actual o en cualquier semana
// futura; no se permiten semanas pasadas (mínimo = lunes de la semana actual).
import { estado, guardarEventosEnEstado } from '../datos/estado.js';
import { aTexto, deTexto, indiceDia, lunesDeSemana, sumarDias } from '../nucleo/tiempo.js';
import { ajustarHoras, avisoPorDefecto, normalizarEvento, FIN_DIA } from '../nucleo/nucleo.js';
import { fechaDeEvento } from '../nucleo/nucleo.js';
import { crear } from './dom.js';
import { abrirDialogo } from './dialogo.js';
import { mostrarAlerta } from './alerta.js';
import { ruedaDe } from './rueda.js';

const $ = (id) => document.getElementById(id);
let editando = null; // evento que se está editando (null = nuevo)

/* ---------- Ayudas de formulario ---------- */
function marcarGrupo(id, valor) {
  $(id).querySelectorAll(':scope > button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === String(valor))));
}
function leerGrupo(id) {
  return $(id).querySelector(':scope > [aria-pressed="true"]')?.dataset.valor;
}
function fijarInterruptor(id, activo) {
  const boton = $(id);
  boton.setAttribute('aria-checked', String(activo));
  if (boton.dataset.revela) $(boton.dataset.revela).hidden = !activo;
}
const interruptorActivo = (id) => $(id).getAttribute('aria-checked') === 'true';
const esUnaVez = () => leerGrupo('evento-repeticion') === 'una-vez';

function marcarDia(fecha) {
  marcarGrupo('evento-dias', indiceDia(fecha));
}

/* ---------- Abrir la hoja ---------- */
/**
 * abrirHojaEvento({ id }) edita un evento.
 * abrirHojaEvento({ dia, repeticion, fecha, titulo, inicio, fin }) crea uno nuevo.
 */
export function abrirHojaEvento(opciones = {}) {
  const ahora = new Date();
  editando = opciones.id ? estado.eventos.find((e) => e.id === opciones.id) || null : null;
  const datos = editando
    ? { titulo: editando.titulo, repeticion: editando.repeticion, fecha: fechaDeEvento(editando, ahora), inicio: editando.inicio, fin: editando.fin, nota: editando.nota, aviso: editando.aviso }
    : {
      titulo: opciones.titulo || '',
      repeticion: opciones.repeticion || 'indefinido',
      fecha: opciones.fecha || sumarDias(lunesDeSemana(ahora), opciones.dia ?? indiceDia(ahora)),
      inicio: opciones.inicio ?? 540,
      fin: opciones.fin ?? 600,
      nota: '',
      aviso: avisoPorDefecto(),
    };

  $('titulo-hoja-evento').textContent = editando ? 'Editar evento' : 'Nuevo evento';
  $('evento-titulo').value = datos.titulo;
  marcarDia(datos.fecha);
  marcarGrupo('evento-repeticion', datos.repeticion);
  $('evento-fecha').min = aTexto(lunesDeSemana(ahora));
  $('evento-fecha').value = aTexto(datos.fecha);
  $('fecha-una-vez').hidden = datos.repeticion !== 'una-vez';
  fijarInterruptor('interruptor-aviso-ev', datos.aviso.activo);
  marcarGrupo('antelacion-ev', datos.aviso.antes);
  $('evento-nota').value = datos.nota;
  $('nota-evento').hidden = !datos.nota;
  $('enlace-nota-evento').hidden = Boolean(datos.nota);
  $('evento-borrar').hidden = !editando;
  dibujarTurnos();

  abrirDialogo('hoja-evento');
  ruedaDe('rueda-evento-inicio').fijar(datos.inicio);
  ruedaDe('rueda-evento-fin').fijar(datos.fin);
}

/** Botones de turnos guardados (tocar uno rellena las horas). */
function dibujarTurnos() {
  $('campo-turnos').hidden = !estado.turnos.length;
  $('evento-turnos').replaceChildren(...estado.turnos.map((turno) =>
    crear('button', { type: 'button', 'data-aplicar-turno': turno.id }, turno.nombre)));
}

/* ---------- Guardar y borrar ---------- */
function guardar() {
  const fecha = deTexto($('evento-fecha').value) || new Date();
  const horas = ajustarHoras(ruedaDe('rueda-evento-inicio').leer(), ruedaDe('rueda-evento-fin').leer(), 'fin');
  const activo = interruptorActivo('interruptor-aviso-ev');
  const resultado = normalizarEvento({
    id: editando?.id, // al editar a mano, un evento de plan pasa a ser manual (sin origen)
    titulo: $('evento-titulo').value,
    dia: Number(leerGrupo('evento-dias')),
    repeticion: leerGrupo('evento-repeticion'),
    fecha,
    inicio: horas.inicio,
    fin: horas.fin,
    nota: $('evento-nota').value,
    aviso: { activo, antes: Number(leerGrupo('antelacion-ev')), configurado: activo || editando?.aviso.configurado },
  });
  if (resultado.error) {
    mostrarAlerta({ titulo: 'Semana pasada', texto: 'Un evento de una sola vez no puede ir en una semana que ya terminó.' });
    return;
  }
  const evento = resultado.evento;
  guardarEventosEnEstado(editando
    ? estado.eventos.map((e) => (e.id === editando.id ? evento : e))
    : [...estado.eventos, evento]);
  $('hoja-evento').close();
  if (evento.fin === FIN_DIA) avisarFinDeDia(evento);
}

function borrar() {
  if (!editando) return;
  guardarEventosEnEstado(estado.eventos.filter((e) => e.id !== editando.id));
  $('hoja-evento').close();
}

/** Aviso de fin de día: ofrece crear el evento del día siguiente de 00:00 a 01:00. */
function avisarFinDeDia(evento) {
  mostrarAlerta({
    titulo: 'El evento llega hasta las 23:55',
    texto: 'Un evento no puede cruzar la medianoche. ¿Quieres crear la continuación?',
    botones: [
      { texto: 'Entendido' },
      { texto: 'Crear ahora', accion: () => {
        const fecha = fechaDeEvento(evento, new Date());
        const siguiente = sumarDias(fecha, 1);
        abrirHojaEvento({ titulo: evento.titulo, repeticion: evento.repeticion, fecha: siguiente, inicio: 0, fin: 60 });
      } },
    ],
  });
}

/* ---------- Conexiones de la hoja ---------- */
export function iniciarHojaEvento() {
  const inicio = ruedaDe('rueda-evento-inicio');
  const fin = ruedaDe('rueda-evento-fin');

  // Reglas de horas al mover cada rueda
  inicio.alCambiar((valor) => {
    const r = ajustarHoras(valor, fin.leer(), 'inicio');
    if (r.inicio !== valor) inicio.fijar(r.inicio);
    if (r.fin !== fin.leer()) fin.fijar(r.fin);
  });
  fin.alCambiar((valor) => {
    const r = ajustarHoras(inicio.leer(), valor, 'fin');
    if (r.fin !== valor) fin.fijar(r.fin);
  });

  // Al elegir una fecha, se marca su día de la semana
  $('evento-fecha').addEventListener('change', (evento) => {
    let fecha = deTexto(evento.target.value);
    const minimo = deTexto(evento.target.min);
    if (!fecha || (minimo && fecha < minimo)) { // vacía o de una semana pasada
      fecha = minimo || new Date();
      evento.target.value = aTexto(fecha);
    }
    marcarDia(fecha);
  });

  document.addEventListener('cambio', (e) => {
    const { grupo, valor } = e.detail || {};
    if (grupo === 'dia-evento' && esUnaVez()) { // la fecha se mueve a ese día de su semana
      const base = deTexto($('evento-fecha').value) || new Date();
      $('evento-fecha').value = aTexto(sumarDias(lunesDeSemana(base), Number(valor)));
    }
    if (grupo === 'repeticion-evento') $('fecha-una-vez').hidden = valor !== 'una-vez';
  });

  $('enlace-nota-evento').addEventListener('click', () => {
    $('nota-evento').hidden = false;
    $('enlace-nota-evento').hidden = true;
    $('evento-nota').focus();
  });

  $('evento-turnos').addEventListener('click', (e) => {
    const boton = e.target.closest('[data-aplicar-turno]');
    const turno = estado.turnos.find((t) => t.id === boton?.dataset.aplicarTurno);
    if (!turno) return;
    inicio.fijar(turno.inicio);
    fin.fijar(turno.fin);
    if (!$('evento-titulo').value.trim()) $('evento-titulo').value = turno.nombre;
  });

  $('evento-guardar').addEventListener('click', guardar);
  $('evento-borrar').addEventListener('click', borrar);
  $('evento-titulo').addEventListener('keydown', (e) => { if (e.key === 'Enter') guardar(); });
}
