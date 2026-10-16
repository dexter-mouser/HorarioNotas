// almacenamiento.js — Única puerta de acceso a localStorage
// (fondo-inicial.js solo lee, para pintar sin parpadeo).

export const CLAVES = {
  eventos: 'horario:eventos',
  notas: 'horario:notas',
  turnos: 'horario:turnos',
  avisos: 'horario:avisos',
  fondo: 'horario:fondo',
  modo: 'horario:modo',
  acento: 'horario:acento',
  acentoVariables: 'horario:acento-vars',
  indicador: 'horario:indicador',
};

/** Lee un texto; devuelve `porDefecto` si no existe o falla. */
export function leerTexto(clave, porDefecto = null) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? porDefecto : valor;
  } catch {
    return porDefecto;
  }
}

/** Guarda un texto; devuelve false si no fue posible. */
export function guardarTexto(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
    return true;
  } catch {
    return false;
  }
}

/** Lee un valor JSON; ante datos dañados devuelve `porDefecto`. */
export function leerJSON(clave, porDefecto = null) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

/** Guarda un valor como JSON (una sola escritura). */
export function guardarJSON(clave, valor) {
  return guardarTexto(clave, JSON.stringify(valor));
}

// ESPACIO PARA LA LÓGICA (fase 2 en adelante):
// cargarEventos / guardarEventos, cargarNotas / guardarNotas,
// cargarTurnos / guardarTurnos, cargarAvisos / guardarAvisos,
// cada una validando los elementos al leer y descartando lo dañado.
