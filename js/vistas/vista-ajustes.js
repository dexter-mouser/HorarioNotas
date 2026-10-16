// vista-ajustes.js — Modo, acento y fondo (los turnos y avisos llegan con su lógica)
import { crear } from '../componentes/dom.js';
import { ACENTOS, MODOS, obtenerModo, fijarModo, obtenerAcento, fijarAcento } from '../servicios/tema.js';
import { FONDOS, obtenerFondo, fijarFondo } from '../servicios/fondos.js';
import { INDICADORES, obtenerIndicador, fijarIndicador } from '../servicios/indicador.js';
import { icono } from '../componentes/iconos.js';

function dibujarModos() {
  const grupo = document.getElementById('modo-opciones');
  const actual = obtenerModo();
  MODOS.forEach((modo) => {
    grupo.append(crear('button', { type: 'button', 'data-valor': modo.id, 'aria-pressed': String(modo.id === actual) }, modo.nombre));
  });
  grupo.addEventListener('cambio', (evento) => fijarModo(evento.detail.valor));
}

function dibujarAcentos() {
  const contenedor = document.getElementById('acentos');
  const texto = document.getElementById('acento-nombre');
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

function dibujarFondos() {
  const contenedor = document.getElementById('fondo-opciones');
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

function dibujarIndicadores() {
  const contenedor = document.getElementById('indicador-opciones');
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

export function iniciarAjustes() {
  dibujarModos();
  dibujarIndicadores();
  dibujarAcentos();
  dibujarFondos();
  // ESPACIO PARA LA LÓGICA: turnos (fase 3) y avisos (fase 6)
}
