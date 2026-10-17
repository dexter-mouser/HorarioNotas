// vista-plan.js — Hoja de planificación de una semana con turnos
import { estado, guardarEventosEnEstado } from '../datos/estado.js';
import { aTexto, formatoHora, lunesDeSemana, rangoSemana } from '../nucleo/tiempo.js';
import { NOMBRES_DIA } from '../nucleo/tiempo.js';
import { planificarSemana } from '../nucleo/turnos.js';
import { crear } from '../componentes/dom.js';
import { abrirDialogo } from '../componentes/dialogo.js';
import { mostrarAlerta } from '../componentes/alerta.js';

const $ = (id) => document.getElementById(id);
let lunesPlan = null;

/** Abre la planificación de la semana que empieza en `lunes`. */
export function abrirPlan(lunes) {
  lunesPlan = lunes;
  const ahora = new Date();
  const esPasada = aTexto(lunes) < aTexto(lunesDeSemana(ahora));
  $('rango-plan').textContent = rangoSemana(lunes);

  // Semanas pasadas: solo se admite "Indefinido"
  const botones = $('plan-tipo').querySelectorAll(':scope > button');
  botones.forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.valor === 'indefinido'));
    if (b.dataset.valor === 'una-vez') b.disabled = esPasada;
  });
  $('plan-ayuda').hidden = !esPasada && Boolean(estado.turnos.length);
  $('plan-ayuda').textContent = !estado.turnos.length
    ? 'Primero crea turnos en Ajustes.'
    : 'Las semanas pasadas solo admiten Indefinido.';

  $('plan-filas').replaceChildren(...NOMBRES_DIA.map((nombre, dia) => {
    const selector = crear('select', { class: 'entrada', 'data-dia': String(dia), 'aria-label': `Turno del ${nombre.toLowerCase()}` },
      crear('option', { value: '' }, 'Libre'),
      ...estado.turnos.map((t) => crear('option', { value: t.id }, `${t.nombre} · ${formatoHora(t.inicio)}–${formatoHora(t.fin)}`)));
    return crear('label', { class: 'fila-plan' }, crear('span', {}, nombre), selector);
  }));
  abrirDialogo('hoja-plan');
}

function aplicar() {
  const asignaciones = [...$('plan-filas').querySelectorAll('select')].map((s) => s.value || null);
  const tipo = $('plan-tipo').querySelector('[aria-pressed="true"]').dataset.valor;
  const resultado = planificarSemana({ eventos: estado.eventos, turnos: estado.turnos, asignaciones, tipo, lunes: lunesPlan, ahora: new Date() });
  if (resultado.error) {
    mostrarAlerta({ titulo: 'Semana pasada', texto: 'No se puede planificar por una vez una semana que ya terminó.' });
    return;
  }
  guardarEventosEnEstado(resultado.eventos);
  $('hoja-plan').close();
  if (resultado.diasFinDia.length) {
    mostrarAlerta({
      titulo: 'Turnos hasta las 23:55',
      texto: 'Estos días el turno llega hasta las 23:55. Un evento no cruza la medianoche; crea la continuación del día siguiente si la necesitas.',
      lineas: resultado.diasFinDia.map((dia) => NOMBRES_DIA[dia]),
    });
  }
}

export function iniciarPlan() {
  $('plan-aplicar').addEventListener('click', aplicar);
}
