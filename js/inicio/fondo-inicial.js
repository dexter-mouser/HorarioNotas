// fondo-inicial.js — Aplica modo, acento y fondo guardados ANTES de pintar.
// Script clásico (no módulo) para evitar parpadeos. Solo LEE localStorage.
(function () {
  var FONDOS_CON_IMAGEN = []; // ids de los fondos con imagen (hoy solo existe Estándar)
  try {
    var raiz = document.documentElement;
    var modo = localStorage.getItem('horario:modo');
    if (modo === 'claro' || modo === 'oscuro') raiz.dataset.tema = modo;

    // Solo se aceptan variables conocidas con valor hexadecimal
    var variables = JSON.parse(localStorage.getItem('horario:acento-vars') || 'null');
    if (variables) {
      for (var nombre in variables) {
        if (/^--(acento|texto-sobre|acento-texto)-[oc]$/.test(nombre) && /^#[0-9a-f]{6}$/i.test(variables[nombre])) {
          raiz.style.setProperty(nombre, variables[nombre]);
        }
      }
    }
    var fondo = localStorage.getItem('horario:fondo');
    if (FONDOS_CON_IMAGEN.indexOf(fondo) !== -1) raiz.dataset.fondo = fondo;
  } catch (error) { /* sin almacenamiento: se usan los valores por defecto */ }
})();
