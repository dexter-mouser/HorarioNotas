// app.js — Arranque, navegación, temporizador de un minuto y avisos
import { iniciarTema, alternarModo, modoEfectivo } from './servicios/tema.js';
import { iniciarFondo } from './servicios/fondos.js';
import { aplicarIndicador } from './servicios/indicador.js';
import { mostrarNotificacion } from './servicios/notificaciones.js';
import { estado, iniciarEstado, refrescarFecha, guardarNotasEnEstado, guardarAvisosEnEstado } from './datos/estado.js';
import { avisosPendientes, purgarMostrados } from './nucleo/avisos.js';
import { puedeFijar } from './nucleo/notas.js';
import { NOMBRES_DIA, formatoHora, indiceDia, lunesDeSemana, sumarDias } from './nucleo/tiempo.js';
import { montarIconos, icono } from './componentes/iconos.js';
import { iniciarDialogos, abrirDialogo } from './componentes/dialogo.js';
import { iniciarInterruptores } from './componentes/interruptor.js';
import { iniciarSegmentados } from './componentes/segmentado.js';
import { iniciarAbanico } from './componentes/abanico.js';
import { montarRuedas } from './componentes/rueda.js';
import { aplicarMedidas } from './componentes/medidas.js';
import { mostrarAlerta } from './componentes/alerta.js';
import { abrirHojaEvento, iniciarHojaEvento } from './componentes/hoja.js';
import { abrirHojaNota, iniciarHojaNota } from './componentes/hoja-nota.js';
import { abrirHojaTurno, iniciarHojaTurno } from './componentes/hoja-turno.js';
import { abrirPlan, iniciarPlan } from './vistas/vista-plan.js';
import { dibujarHoy } from './vistas/vista-hoy.js';
import { dibujarSemana } from './vistas/vista-semana.js';
import { dibujarCalendario, iniciarCalendario } from './vistas/vista-calendario.js';
import { dibujarAjustes, iniciarAjustes } from './vistas/vista-ajustes.js';

const PESTANAS = ['hoy', 'semana', 'calendario', 'ajustes'];
const DIBUJAR = { hoy: dibujarHoy, semana: dibujarSemana, calendario: dibujarCalendario, ajustes: dibujarAjustes };
const MINUTO_MS = 60000;

/* ---------- Navegación ---------- */
function dibujarVista() {
  DIBUJAR[estado.pestana]();
  aplicarMedidas(document.getElementById(`vista-${estado.pestana}`));
}

function irA(nombre) {
  if (!PESTANAS.includes(nombre)) return;
  estado.pestana = nombre;
  PESTANAS.forEach((id) => { document.getElementById(`vista-${id}`).hidden = id !== nombre; });
  document.querySelectorAll('.barra button').forEach((boton) => {
    if (boton.dataset.pestana === nombre) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  });
  dibujarVista();
  document.getElementById('vistas').scrollTop = 0;
}

function mostrarSubvistaHoy(valor) {
  document.getElementById('agenda').hidden = valor !== 'agenda';
  document.getElementById('notas').hidden = valor !== 'notas';
  document.querySelectorAll('[data-segmentado="vista-hoy"] > button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === valor)));
}

/** Botón sol/luna de Hoy: muestra el modo al que se cambiaría. */
function actualizarBotonModo() {
  const boton = document.getElementById('boton-modo');
  const esOscuro = modoEfectivo() === 'oscuro';
  boton.replaceChildren(icono(esOscuro ? 'sol' : 'luna', esOscuro ? 'Sol' : 'Luna'));
  boton.setAttribute('aria-label', esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

/* ---------- Acciones ---------- */
/** Fija o suelta una nota (máximo 3 fijadas). */
function alternarFijada(id) {
  const nota = estado.notas.find((n) => n.id === id);
  if (!nota) return;
  if (!nota.fijada && !puedeFijar(estado.notas)) {
    mostrarAlerta({ titulo: 'Máximo de notas fijadas', texto: 'Ya hay 3 notas fijadas. Suelta una antes de fijar otra.' });
    return;
  }
  guardarNotasEnEstado(estado.notas.map((n) => (n.id === id
    ? { ...n, fijada: !n.fijada, fijadaEn: n.fijada ? 0 : Date.now() }
    : n)));
}

/** Valores por defecto del evento nuevo según la pantalla desde la que se crea. */
function nuevoEvento() {
  const ahora = new Date();
  if (estado.pestana === 'calendario') {
    const lunesActual = lunesDeSemana(ahora);
    const esPasada = lunesDeSemana(estado.diaCalendario) < lunesActual;
    if (esPasada) abrirHojaEvento({ dia: indiceDia(estado.diaCalendario) });
    else abrirHojaEvento({ repeticion: 'una-vez', fecha: estado.diaCalendario });
    return;
  }
  abrirHojaEvento({ dia: estado.pestana === 'hoy' ? estado.diaVisto : indiceDia(ahora) });
}

function nuevaNota() {
  abrirHojaNota(estado.pestana === 'calendario' ? { fecha: estado.diaCalendario } : {});
}

function iniciarEventosGenerales() {
  document.addEventListener('click', (evento) => {
    const destino = evento.target;
    const pestana = destino.closest('.barra button');
    if (pestana) return irA(pestana.dataset.pestana);

    const dia = destino.closest('[data-ir-dia]');
    if (dia) {
      estado.diaVisto = Number(dia.dataset.irDia);
      mostrarSubvistaHoy('agenda');
      return irA('hoy');
    }
    const botonEvento = destino.closest('[data-evento]');
    if (botonEvento) return abrirHojaEvento({ id: botonEvento.dataset.evento });
    const fijar = destino.closest('[data-fijar]');
    if (fijar) return alternarFijada(fijar.dataset.fijar);
    const botonNota = destino.closest('[data-nota]');
    if (botonNota) return abrirHojaNota({ id: botonNota.dataset.nota });
    const turno = destino.closest('[data-turno]');
    if (turno) return abrirHojaTurno({ id: turno.dataset.turno });

    const nuevo = destino.closest('[data-nuevo]')?.dataset.nuevo;
    if (nuevo === 'evento') return nuevoEvento();
    if (nuevo === 'nota') return nuevaNota();
    if (nuevo === 'turno') return abrirHojaTurno();

    if (destino.closest('[data-planificar]')) {
      const referencia = estado.pestana === 'calendario' ? estado.diaCalendario : new Date();
      return abrirPlan(lunesDeSemana(referencia));
    }
    if (destino.closest('[data-resumen]')) return mostrarSubvistaHoy('notas');
    if (destino.closest('[data-ayuda]')) abrirDialogo('hoja-ayuda');
  });

  document.addEventListener('cambio', (evento) => {
    const { grupo, valor } = evento.detail || {};
    if (grupo === 'vista-hoy') mostrarSubvistaHoy(valor);
    if (grupo === 'dia-hoy') {
      estado.diaVisto = Number(valor);
      dibujarHoy();
    }
  });

  document.getElementById('boton-modo').addEventListener('click', alternarModo);
  document.addEventListener('tema:cambio', actualizarBotonModo);
  document.addEventListener('datos:cambio', dibujarVista);
}

/* ---------- Avisos ---------- */
/** Muestra los avisos que ya les toca (en la app y, en segundo plano, del sistema). */
function revisarAvisos({ alAbrir = false } = {}) {
  const ahora = new Date();
  const avisos = estado.avisos;
  if (!avisos.general) {
    avisos.ultimaRevision = ahora.getTime();
    guardarAvisosEnEstado();
    return;
  }
  const pendientes = avisosPendientes(estado.eventos, estado.notas, ahora, avisos.mostrados);
  avisos.ultimaRevision = ahora.getTime();
  pendientes.forEach((p) => { avisos.mostrados[p.clave] = ahora.getTime(); });
  avisos.mostrados = purgarMostrados(avisos.mostrados, ahora);
  guardarAvisosEnEstado();
  if (!pendientes.length) return;

  const lineas = pendientes.map((p) => {
    const fecha = new Date(p.base);
    return `${p.titulo} · ${p.tipo === 'nota' ? 'vence ' : ''}${NOMBRES_DIA[indiceDia(fecha)].toLowerCase()} ${formatoHora(fecha.getHours() * 60 + fecha.getMinutes())}`;
  });
  mostrarAlerta({
    titulo: alAbrir ? 'Avisos que no viste' : (pendientes.length === 1 ? 'Aviso' : 'Avisos'),
    lineas,
  });
  if (document.hidden) mostrarNotificacion('Horario', lineas.join('\n'));
}

/* ---------- Temporizador (uno por minuto) ---------- */
function cadaMinuto() {
  if (refrescarFecha()) {
    mostrarSubvistaHoy('agenda');
  }
  revisarAvisos();
  if (!document.hidden) dibujarVista(); // actualiza "Ahora" y las etiquetas de tiempo
}

function iniciarTemporizador() {
  setInterval(cadaMinuto, MINUTO_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) cadaMinuto();
  });
}

/* ---------- Teclado en el celular ---------- */
/** Al cerrar el teclado, el navegador puede dejar la página desplazada: se devuelve a su sitio. */
function iniciarTeclado() {
  document.addEventListener('focusout', () => {
    setTimeout(() => {
      const activo = document.activeElement;
      if (!activo || !/^(INPUT|TEXTAREA|SELECT)$/.test(activo.tagName)) window.scrollTo(0, 0);
    }, 120);
  });
}

/* ---------- Sin conexión ---------- */
function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch(() => { /* requiere HTTPS o localhost */ });
}

/* ---------- Arranque ---------- */
function iniciar() {
  iniciarTema();
  iniciarFondo();
  iniciarEstado();
  montarIconos();
  montarRuedas();
  iniciarDialogos();
  iniciarInterruptores();
  iniciarSegmentados();
  iniciarAbanico();
  iniciarHojaEvento();
  iniciarHojaNota();
  iniciarHojaTurno();
  iniciarPlan();
  iniciarCalendario();
  iniciarAjustes();
  iniciarEventosGenerales();
  actualizarBotonModo();
  aplicarIndicador();
  irA('hoy');
  iniciarTemporizador();
  iniciarTeclado();
  revisarAvisos({ alAbrir: true });
  registrarServiceWorker();
}

iniciar();
