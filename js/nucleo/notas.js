// notas.js — Límite, estado, orden y fijado de notas (sin DOM)
import { aTexto, deTexto, fechaConHora, formatoHora } from './tiempo.js';
import { crearId, normalizarAviso, FIN_DIA } from './nucleo.js';

export const MAX_TITULO_NOTA = 60;
export const MAX_TEXTO_NOTA = 2000;
export const MAX_NOTAS = 200;
export const MAX_FIJADAS = 3;
export const ANTELACIONES_NOTA = [0, 10, 60, 1440];

/** Momento exacto (ms) en que vence una nota con límite. */
export function limiteEnMs(nota) {
  const fecha = deTexto(nota.limite.fecha);
  return fechaConHora(fecha, nota.limite.hora ?? FIN_DIA).getTime();
}

function duracion(ms) {
  const minutos = Math.floor(ms / 60000);
  if (minutos < 60) return `${Math.max(minutos, 1)} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? '1 día' : `${dias} días`;
}

/** Estado de una nota: { tipo: indefinida | futura | hoy | vencida, texto }. */
export function estadoNota(nota, ahora = new Date()) {
  if (!nota.limite) return { tipo: 'indefinida', texto: 'Indefinida' };
  const diferencia = limiteEnMs(nota) - ahora.getTime();
  if (diferencia < 0) return { tipo: 'vencida', texto: `Vencida · hace ${duracion(-diferencia)}` };
  if (nota.limite.fecha === aTexto(ahora)) {
    return { tipo: 'hoy', texto: `Vence hoy · ${formatoHora(nota.limite.hora ?? FIN_DIA)}` };
  }
  return { tipo: 'futura', texto: `Vence en ${duracion(diferencia)}` };
}

/** Separa las notas en fijadas, con límite y sin límite, ya ordenadas. */
export function agruparNotas(notas, ahora = new Date()) {
  const porLimite = (a, b) => limiteEnMs(a) - limiteEnMs(b);
  const fijadas = notas.filter((n) => n.fijada).sort((a, b) => {
    const va = a.limite && estadoNota(a, ahora).tipo === 'vencida';
    const vb = b.limite && estadoNota(b, ahora).tipo === 'vencida';
    if (va !== vb) return va ? -1 : 1;
    if (a.limite && b.limite) return porLimite(a, b);
    if (a.limite !== b.limite) return a.limite ? -1 : 1;
    return b.fijadaEn - a.fijadaEn;
  });
  const sueltas = notas.filter((n) => !n.fijada);
  return {
    fijadas,
    conLimite: sueltas.filter((n) => n.limite).sort(porLimite),
    sinLimite: sueltas.filter((n) => !n.limite).sort((a, b) => b.editada - a.editada),
  };
}

/** Notas que vencen en una fecha, por hora. */
export function notasDelDia(notas, fecha) {
  const texto = aTexto(fecha);
  return notas
    .filter((n) => n.limite && n.limite.fecha === texto)
    .sort((a, b) => (a.limite.hora ?? FIN_DIA) - (b.limite.hora ?? FIN_DIA));
}

/** Texto del resumen: "1 nota vence hoy · 1 vencida" (vacío si no hay nada). */
export function textoResumen(notas, ahora = new Date()) {
  let hoy = 0;
  let vencidas = 0;
  for (const nota of notas) {
    const tipo = estadoNota(nota, ahora).tipo;
    if (tipo === 'hoy') hoy += 1;
    if (tipo === 'vencida') vencidas += 1;
  }
  const partes = [];
  if (hoy) partes.push(`${hoy} ${hoy === 1 ? 'nota vence' : 'notas vencen'} hoy`);
  if (vencidas) partes.push(`${vencidas} ${vencidas === 1 ? 'vencida' : 'vencidas'}`);
  return partes.join(' · ');
}

/** ¿Se puede fijar otra nota (sin contar `idExcluido`)? */
export function puedeFijar(notas, idExcluido = null) {
  return notas.filter((n) => n.fijada && n.id !== idExcluido).length < MAX_FIJADAS;
}

/** Convierte los datos de la hoja en una nota válida. */
export function normalizarNota(datos, anterior = null) {
  const fecha = datos.limite ? deTexto(datos.limite.fecha) : null;
  const limite = fecha ? { fecha: aTexto(fecha), hora: Number.isInteger(datos.limite.hora) ? datos.limite.hora : null } : null;
  const fijada = datos.fijada === true;
  const aviso = normalizarAviso(datos.aviso, ANTELACIONES_NOTA);
  if (!limite) aviso.activo = false; // el aviso necesita fecha límite
  return {
    id: datos.id || crearId(),
    titulo: String(datos.titulo || '').trim().slice(0, MAX_TITULO_NOTA) || 'Sin título',
    texto: String(datos.texto || '').slice(0, MAX_TEXTO_NOTA),
    limite,
    fijada,
    fijadaEn: fijada ? (anterior && anterior.fijada ? anterior.fijadaEn : Date.now()) : 0,
    aviso,
    editada: Date.now(),
  };
}

/** Valida una nota leída del almacenamiento; devuelve la nota limpia o null. */
export function validarNota(obj) {
  if (!obj || typeof obj !== 'object' || typeof obj.id !== 'string' || !obj.id) return null;
  let limite = null;
  if (obj.limite) {
    if (!deTexto(obj.limite.fecha)) return null;
    const hora = obj.limite.hora;
    const horaValida = hora === null || (Number.isInteger(hora) && hora >= 0 && hora <= FIN_DIA);
    limite = { fecha: obj.limite.fecha, hora: horaValida ? hora : null };
  }
  const fijada = obj.fijada === true;
  return {
    id: obj.id.slice(0, 40),
    titulo: String(obj.titulo ?? '').slice(0, MAX_TITULO_NOTA) || 'Sin título',
    texto: String(obj.texto ?? '').slice(0, MAX_TEXTO_NOTA),
    limite,
    fijada,
    fijadaEn: fijada && Number.isFinite(obj.fijadaEn) ? obj.fijadaEn : 0,
    aviso: normalizarAviso(obj.aviso, ANTELACIONES_NOTA),
    editada: Number.isFinite(obj.editada) ? obj.editada : 0,
  };
}
