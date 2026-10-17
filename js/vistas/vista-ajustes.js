// vista-ajustes.js — Modo, acento, indicador, fondo, turnos y avisos
import { crear } from '../componentes/dom.js';
import { icono } from '../componentes/iconos.js';
import { estado, guardarAvisosEnEstado, guardarEventosEnEstado, guardarNotasEnEstado } from '../datos/estado.js';
import { ACENTOS, MODOS, obtenerModo, fijarModo, obtenerAcento, fijarAcento } from '../servicios/tema.js';
import { FONDOS, obtenerFondo, fijarFondo } from '../servicios/fondos.js';
import { INDICADORES, obtenerIndicador, fijarIndicador } from '../servicios/indicador.js';
import { permisoActual, textoPermiso, solicitarPermiso } from '../servicios/notificaciones.js';
import { exportarICS } from '../servicios/exportar.js';
import { proximosAvisos } from '../nucleo/avisos.js';
import { generarICS } from '../nucleo/archivo-ics.js';
import { ANTELACIONES_NOTA } from '../nucleo/notas.js';
import { ANTELACIONES_EVENTO, normalizarAviso } from '../nucleo/nucleo.js';
import { MAX_TURNOS } from '../nucleo/turnos.js';
import { NOMBRES_DIA, formatoHora, indiceDia } from '../nucleo/tiempo.js';
import { mostrarAlerta } from '../componentes/alerta.js';

const $ = (id) => document.getElementById(id);

/* ---------- Apariencia (se dibuja una sola vez) ---------- */
function dibujarModos() {
  const grupo = $('modo-opciones');
  const actual = obtenerModo();
  MODOS.forEach((modo) => {
    grupo.append(crear('button', { type: 'button', 'data-valor': modo.id, 'aria-pressed': String(modo.id === actual) }, modo.nombre));
  });
  grupo.addEventListener('cambio', (evento) => fijarModo(evento.detail.valor));
}

function dibujarAcentos() {
  const contenedor = $('acentos');
  const texto = $('acento-nombre');
  const libre = crear('input', { type: 'color', 'aria-label': 'Elegir un color libre' });
  const envoltura = crear('label', { class: 'muestra-libre' }, libre);

  function marcar() {
    const { hex, nombre, predefinido } = obtenerAcento();
    contenedor.querySelectorAll('.muestra').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.hex === hex)));
    envoltura.classList.toggle('seleccionada', !predefinido);
    libre.value = hex;
    texto.textContent = `${nombre} · ${hex}`;
  }

  ACENTOS.forEach((acento) => {
    const boton = crear('button', { type: 'button', class: 'muestra', 'aria-label': acento.nombre, 'aria-pressed': 'false', 'data-hex': acento.hex });
    boton.style.setProperty('--color', acento.hex);
    boton.addEventListener('click', () => { fijarAcento(acento.hex); marcar(); });
    contenedor.append(boton);
  });
  libre.addEventListener('input', () => { fijarAcento(libre.value); marcar(); });
  contenedor.append(envoltura);
  marcar();
}

function dibujarIndicadores() {
  const contenedor = $('indicador-opciones');
  const actual = obtenerIndicador();
  INDICADORES.forEach((indicador) => {
    const boton = crear('button', { type: 'button', class: 'fondo-opcion', 'aria-pressed': String(indicador.id === actual) },
      crear('span', { class: 'miniatura centrado' }, icono(indicador.id, indicador.nombre)), indicador.nombre);
    boton.addEventListener('click', () => {
      fijarIndicador(indicador.id);
      contenedor.querySelectorAll('.fondo-opcion').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    });
    contenedor.append(boton);
  });
}

function dibujarFondos() {
  const contenedor = $('fondo-opciones');
  const actual = obtenerFondo();
  FONDOS.forEach((fondo) => {
    const boton = crear('button', { type: 'button', class: 'fondo-opcion', 'aria-pressed': String(fondo.id === actual), 'data-id': fondo.id },
      crear('span', { class: 'miniatura', 'data-fondo': fondo.id, 'aria-hidden': 'true' }), fondo.nombre);
    boton.addEventListener('click', () => {
      fijarFondo(fondo.id);
      contenedor.querySelectorAll('.fondo-opcion').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    });
    contenedor.append(boton);
  });
}

/* ---------- Turnos y avisos (se redibujan con los datos) ---------- */
function dibujarTurnos() {
  $('lista-turnos').replaceChildren(...estado.turnos.map((turno) =>
    crear('button', { type: 'button', class: 'turno', 'data-turno': turno.id },
      crear('span', {}, turno.nombre), crear('span', {}, `${formatoHora(turno.inicio)} – ${formatoHora(turno.fin)}`))));
  if (!estado.turnos.length) $('lista-turnos').append(crear('p', { class: 'subtitulo' }, 'Sin turnos. Añade el primero.'));
  $('boton-nuevo-turno').hidden = estado.turnos.length >= MAX_TURNOS;
}

function textoAntelacion(minutos) {
  if (minutos === 0) return 'A la hora';
  if (minutos === 1440) return '1 día antes';
  return minutos === 60 ? '1 h antes' : `${minutos} min antes`;
}

function filaAviso(ocurrencia) {
  const { tipo, id, titulo, base, item } = ocurrencia;
  const fecha = new Date(base);
  const permitidas = tipo === 'evento' ? ANTELACIONES_EVENTO : ANTELACIONES_NOTA;
  const selector = crear('select', { class: 'entrada chico', 'aria-label': `Antelación del aviso de ${titulo}` },
    ...permitidas.map((m) => crear('option', { value: String(m) }, textoAntelacion(m))));
  selector.value = String(item.aviso.antes);
  const interruptor = crear('button', {
    type: 'button', class: 'interruptor', role: 'switch',
    'aria-checked': String(item.aviso.activo), 'aria-label': `Aviso de ${titulo}`,
  });
  return crear('div', { class: 'fila-aviso', 'data-tipo': tipo, 'data-id': id },
    crear('div', { class: 'aviso-info' },
      crear('span', { class: 'evento-titulo' }, titulo),
      crear('small', {}, `${tipo === 'nota' ? 'Nota · ' : ''}${NOMBRES_DIA[indiceDia(fecha)].toLowerCase()} ${formatoHora(fecha.getHours() * 60 + fecha.getMinutes())}`)),
    selector, interruptor);
}

function dibujarAvisos() {
  $('aviso-general').setAttribute('aria-checked', String(estado.avisos.general));
  $('texto-permiso').textContent = `Permiso del dispositivo: ${textoPermiso()}`;
  $('boton-permiso').hidden = permisoActual() !== 'default';
  const proximos = proximosAvisos(estado.eventos, estado.notas, new Date());
  $('lista-avisos').replaceChildren(...proximos.map(filaAviso));
  $('sin-avisos').hidden = proximos.length > 0;
}

/** Cambia el aviso de un evento o nota (marca el aviso como "configurado"). */
function cambiarAviso(tipo, id, cambios) {
  const actualizar = (item) => (item.id === id
    ? { ...item, aviso: normalizarAviso({ ...item.aviso, ...cambios, configurado: true }, tipo === 'nota' ? ANTELACIONES_NOTA : ANTELACIONES_EVENTO) }
    : item);
  if (tipo === 'evento') guardarEventosEnEstado(estado.eventos.map(actualizar));
  else guardarNotasEnEstado(estado.notas.map(actualizar));
}

function conectarAvisos() {
  $('aviso-general').addEventListener('cambio', (evento) => {
    estado.avisos.general = evento.detail.activo;
    guardarAvisosEnEstado();
  });
  $('lista-avisos').addEventListener('cambio', (evento) => {
    const fila = evento.target.closest('.fila-aviso');
    if (fila) cambiarAviso(fila.dataset.tipo, fila.dataset.id, { activo: evento.detail.activo });
  });
  $('lista-avisos').addEventListener('change', (evento) => {
    const fila = evento.target.closest('.fila-aviso');
    if (fila) cambiarAviso(fila.dataset.tipo, fila.dataset.id, { antes: Number(evento.target.value) });
  });
  $('boton-permiso').addEventListener('click', async () => {
    await solicitarPermiso();
    dibujarAvisos();
  });
  $('boton-ics').addEventListener('click', async () => {
    const contenido = generarICS(estado.eventos, estado.notas, new Date());
    if (!contenido) {
      mostrarAlerta({ titulo: 'Nada que exportar', texto: 'No hay eventos ni notas con aviso activo.' });
      return;
    }
    await exportarICS(contenido);
  });
}

/** Redibuja lo que depende de los datos. */
export function dibujarAjustes() {
  dibujarTurnos();
  dibujarAvisos();
}

export function iniciarAjustes() {
  dibujarModos();
  dibujarAcentos();
  dibujarIndicadores();
  dibujarFondos();
  conectarAvisos();
  dibujarAjustes();
}
