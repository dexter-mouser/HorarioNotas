// color.js — Contraste y variables del acento (sin DOM)

// Colores de base de cada modo (deben coincidir con tono.css)
const BASES = {
  oscuro: { fondo: '#0d0f14', superficies: ['#161a22', '#1f2430'] },
  claro: { fondo: '#e6e6e3', superficies: ['#f3f3f1', '#dadad6'] },
};
const TEXTO_OSCURO = '#0d0f14';
const TEXTO_CLARO = '#ffffff';
const PASO_MEZCLA = 0.02;

/** Comprueba que sea un color #rrggbb. */
export function esHexValido(texto) {
  return /^#[0-9a-f]{6}$/i.test(texto);
}

function hexARgb(hex) {
  const numero = parseInt(hex.slice(1), 16);
  return [(numero >> 16) & 255, (numero >> 8) & 255, numero & 255];
}

function rgbAHex(rgb) {
  return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/** Luminancia relativa (WCAG). */
export function luminancia(hex) {
  const [r, g, b] = hexARgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razón de contraste entre dos colores (1 a 21). */
export function contraste(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Mezcla `hex` con `objetivo` en la proporción `cantidad` (0 a 1). */
function mezclar(hex, objetivo, cantidad) {
  const a = hexARgb(hex);
  const b = hexARgb(objetivo);
  return rgbAHex(a.map((v, i) => v + (b[i] - v) * cantidad));
}

/** Acerca `hex` a `objetivo` lo mínimo para llegar al contraste sobre todos los fondos. */
function acercarHasta(hex, objetivo, fondos, minimo) {
  for (let p = 0; p <= 1.0001; p += PASO_MEZCLA) {
    const candidato = mezclar(hex, objetivo, Math.min(p, 1));
    if (fondos.every((fondo) => contraste(candidato, fondo) >= minimo)) return candidato;
  }
  return objetivo;
}

/** Elige texto oscuro o blanco, el de mayor contraste sobre el relleno. */
function textoSobre(relleno) {
  return contraste(TEXTO_OSCURO, relleno) >= contraste(TEXTO_CLARO, relleno) ? TEXTO_OSCURO : TEXTO_CLARO;
}

/**
 * Calcula las seis variables del acento (modo oscuro "-o" y claro "-c").
 * - acento: relleno de botones (>= 3:1 sobre el fondo)
 * - texto-sobre: texto sobre el relleno (>= 4.5:1)
 * - acento-texto: acento usable como texto, icono o borde (>= 4.5:1)
 */
export function calcularVariablesAcento(hex) {
  const { oscuro, claro } = BASES;
  const fondosO = [oscuro.fondo, ...oscuro.superficies];
  const fondosC = [claro.fondo, ...claro.superficies];

  const rellenoO = acercarHasta(hex, '#ffffff', fondosO, 3);
  const rellenoC = acercarHasta(hex, '#000000', fondosC, 3);

  return {
    '--acento-o': rellenoO,
    '--texto-sobre-o': textoSobre(rellenoO),
    '--acento-texto-o': acercarHasta(hex, '#ffffff', oscuro.superficies, 4.5),
    '--acento-c': rellenoC,
    '--texto-sobre-c': textoSobre(rellenoC),
    '--acento-texto-c': acercarHasta(hex, '#000000', claro.superficies, 4.5),
  };
}
