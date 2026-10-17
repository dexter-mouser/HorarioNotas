// tiempo.js — Días, semanas, fechas y horas (sin DOM). La semana empieza en lunes.

export const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Índice del día: 0 = lunes … 6 = domingo. */
export function indiceDia(fecha) {
  return (fecha.getDay() + 6) % 7;
}

/** Fecha sin hora, a medianoche local. */
export function soloFecha(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/** Suma (o resta) días a una fecha. */
export function sumarDias(fecha, dias) {
  const resultado = soloFecha(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

/** Lunes de la semana de una fecha. */
export function lunesDeSemana(fecha) {
  return sumarDias(fecha, -indiceDia(fecha));
}

/** Fecha → "AAAA-MM-DD" (formato de <input type="date">). */
export function aTexto(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** "AAAA-MM-DD" → fecha, o null si no es válida. */
export function deTexto(texto) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto || '');
  if (!partes) return null;
  const fecha = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  return aTexto(fecha) === texto ? fecha : null;
}

/** Fecha a una hora dada (minutos desde las 00:00). */
export function fechaConHora(fecha, minutos) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), Math.floor(minutos / 60), minutos % 60);
}

/** Minutos transcurridos desde las 00:00. */
export function minutosDelDia(fecha) {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

/** Minutos → "HH:MM". */
export function formatoHora(minutos) {
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
}

/** "viernes, 16 de octubre". */
export function formatoFechaLarga(fecha) {
  return `${NOMBRES_DIA[indiceDia(fecha)].toLowerCase()}, ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
}

/** "octubre 2026". */
export function formatoMes(fecha) {
  return `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

/** "12 – 18 de octubre" (o con dos meses si la semana los cruza). */
export function rangoSemana(lunes) {
  const domingo = sumarDias(lunes, 6);
  if (lunes.getMonth() === domingo.getMonth()) {
    return `${lunes.getDate()} – ${domingo.getDate()} de ${MESES[domingo.getMonth()]}`;
  }
  return `${lunes.getDate()} de ${MESES[lunes.getMonth()]} – ${domingo.getDate()} de ${MESES[domingo.getMonth()]}`;
}
