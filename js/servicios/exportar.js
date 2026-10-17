// exportar.js — Comparte o descarga el archivo .ics

/** Devuelve 'compartido', 'cancelado' o 'descargado'. */
export async function exportarICS(contenido, nombre = 'horario.ics') {
  const blob = new Blob([contenido], { type: 'text/calendar' });
  const archivo = new File([blob], nombre, { type: 'text/calendar' });

  if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo] });
      return 'compartido';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelado';
    }
  }
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 10000);
  return 'descargado';
}
