// app.js — Arranque, navegación entre pestañas y enlaces de la interfaz
import { iniciarTema, alternarModo, modoEfectivo } from './servicios/tema.js';
import { iniciarFondo } from './servicios/fondos.js';
import { aplicarIndicador } from './servicios/indicador.js';
import { reiniciarHojaEvento, iniciarHojaEvento } from './componentes/hoja.js';
import { indiceDia } from './nucleo/tiempo.js';
import { montarIconos, icono } from './componentes/iconos.js';
import { iniciarDialogos, abrirDialogo } from './componentes/dialogo.js';
import { iniciarInterruptores } from './componentes/interruptor.js';
import { iniciarSegmentados } from './componentes/segmentado.js';
import { iniciarAbanico } from './componentes/abanico.js';
import { montarRuedas, reiniciarRuedas } from './componentes/rueda.js';
import { aplicarMedidas } from './componentes/medidas.js';
import { iniciarAjustes } from './vistas/vista-ajustes.js';

const PESTANAS = ['hoy', 'semana', 'calendario', 'ajustes'];

/** Muestra una pestaña y marca su botón en la barra. */
function irA(nombre) {
  if (!PESTANAS.includes(nombre)) return;
  PESTANAS.forEach((id) => {
    document.getElementById(`vista-${id}`).hidden = id !== nombre;
  });
  document.querySelectorAll('.barra button').forEach((boton) => {
    if (boton.dataset.pestana === nombre) boton.setAttribute('aria-current', 'page');
    else boton.removeAttribute('aria-current');
  });
  document.getElementById('vistas').scrollTop = 0;
}

/** Botón sol/luna de Hoy: muestra el modo al que se cambiaría. */
function actualizarBotonModo() {
  const boton = document.getElementById('boton-modo');
  const esOscuro = modoEfectivo() === 'oscuro';
  boton.replaceChildren(icono(esOscuro ? 'sol' : 'luna', esOscuro ? 'Sol' : 'Luna'));
  boton.setAttribute('aria-label', esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

/** En Hoy queda marcado el día actual al abrir. */
function marcarDiaActual() {
  const hoy = indiceDia(new Date());
  document.querySelectorAll('[data-segmentado="dia-hoy"] > button').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(Number(boton.dataset.valor) === hoy));
  });
}

function iniciarEventosGenerales() {
  document.addEventListener('click', (evento) => {
    const pestana = evento.target.closest('.barra button');
    if (pestana) return irA(pestana.dataset.pestana);

    const ir = evento.target.closest('[data-ir]');
    if (ir) irA(ir.dataset.ir);

    const abrir = evento.target.closest('[data-abrir]');
    if (abrir) {
      const dialogo = abrirDialogo(abrir.dataset.abrir);
      if (dialogo) {
        reiniciarRuedas(dialogo);
        if (dialogo.id === 'hoja-evento') reiniciarHojaEvento();
      }
    }

    const revela = evento.target.closest('[data-revela-nota]'); // enlace "+ Nota"
    if (revela) {
      document.getElementById(revela.dataset.revelaNota).hidden = false;
      revela.hidden = true;
    }

    if (evento.target.closest('[data-resumen]')) { // resumen de notas → vista Notas
      document.querySelector('[data-segmentado="vista-hoy"] [data-valor="notas"]').click();
    }

    const chincheta = evento.target.closest('.chincheta');
    if (chincheta) { // LÓGICA pendiente: máximo 3 fijadas
      const fijada = chincheta.getAttribute('aria-pressed') !== 'true';
      chincheta.setAttribute('aria-pressed', String(fijada));
    }
  });

  document.addEventListener('cambio', (evento) => {
    const { grupo, valor } = evento.detail || {};
    if (grupo === 'vista-hoy') { // Agenda / Notas
      document.getElementById('agenda').hidden = valor !== 'agenda';
      document.getElementById('notas').hidden = valor !== 'notas';
    }
    if (grupo === 'repeticion') { // fecha visible solo en "Por una vez"
      document.getElementById('fecha-una-vez').hidden = valor !== 'una-vez';
    }
  });

  document.getElementById('boton-modo').addEventListener('click', alternarModo);
  document.addEventListener('tema:cambio', actualizarBotonModo);
}

function iniciar() {
  iniciarTema();
  iniciarFondo();
  montarIconos();
  montarRuedas();
  aplicarMedidas();
  iniciarDialogos();
  iniciarInterruptores();
  iniciarSegmentados();
  iniciarAbanico();
  iniciarAjustes();
  iniciarHojaEvento();
  iniciarEventosGenerales();
  marcarDiaActual();
  aplicarIndicador();
  actualizarBotonModo();
  irA('hoy');
}

iniciar();
