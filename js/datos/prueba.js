// prueba.js — Datos de prueba para la primera ejecución.
// Para desactivarlos: CARGAR_DATOS_PRUEBA = false (solo se cargan si no hay datos).
import { aTexto, sumarDias, soloFecha, indiceDia, lunesDeSemana } from '../nucleo/tiempo.js';
import { crearId, avisoPorDefecto } from '../nucleo/nucleo.js';

export const CARGAR_DATOS_PRUEBA = true;

function evento(titulo, dia, inicio, fin, extra = {}) {
  return { id: crearId(), titulo, dia, inicio, fin, nota: 'Prueba', repeticion: 'indefinido', aviso: avisoPorDefecto(), ...extra };
}

function nota(titulo, limite, extra = {}) {
  return { id: crearId(), titulo, texto: 'Prueba', limite, fijada: false, fijadaEn: 0, aviso: avisoPorDefecto(), editada: Date.now(), ...extra };
}

/** Crea eventos, notas y turnos llamados "Prueba" con fechas relativas a hoy. */
export function crearDatosPrueba(ahora = new Date()) {
  const hoy = soloFecha(ahora);
  const dia = indiceDia(hoy);
  return {
    eventos: [
      evento('Prueba 1', dia, 540, 600),
      evento('Prueba 2', dia, 720, 780, { repeticion: 'una-vez', semana: aTexto(lunesDeSemana(hoy)) }),
      evento('Prueba 3', (dia + 1) % 7, 900, 960, { aviso: { activo: false, antes: 10, configurado: true } }),
    ],
    notas: [
      nota('Prueba 1', { fecha: aTexto(hoy), hora: null }, { fijada: true, fijadaEn: Date.now(), aviso: { activo: true, antes: 60, configurado: true } }),
      nota('Prueba 2', { fecha: aTexto(sumarDias(hoy, -2)), hora: 1080 }),
      nota('Prueba 3', { fecha: aTexto(sumarDias(hoy, 3)), hora: 600 }),
      nota('Prueba 4', null),
      nota('Prueba 5', null, { fijada: true, fijadaEn: Date.now() - 1000 }),
    ],
    turnos: [
      { id: crearId(), nombre: 'Prueba 1', inicio: 360, fin: 840 },
      { id: crearId(), nombre: 'Prueba 2', inicio: 840, fin: 1320 },
    ],
  };
}
