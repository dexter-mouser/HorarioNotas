// tiempo.js — Días, semanas y fechas (sin DOM). La semana empieza en lunes.

export const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

// ESPACIO PARA LA LÓGICA (fase 2): formato de fechas largas y de horas.
