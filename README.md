# Horario

Aplicación web para consultar y modificar tu horario semanal desde el celular, con bloc de notas y avisos. Se abre al instante, se ve de un vistazo y se edita en pocos toques.

- Funciona en iPhone y Android.
- Se instala desde el navegador (PWA) y trabaja sin conexión.
- Sin servidores, cuentas ni librerías externas.
- Tipografía del sistema. Todos los datos se guardan en el propio dispositivo.

---

## 1. Qué permite hacer

- Ver los eventos de cualquier día de la semana, ordenados por hora.
- Ver la semana completa de un vistazo y consultar cualquier mes en un calendario.
- Crear, editar y borrar eventos que se repiten cada semana o que valen una sola vez.
- Guardar notas con o sin fecha límite y fijar las más importantes en la pantalla Hoy.
- Activar o desactivar el aviso de cada evento y de cada nota.
- Guardar turnos predefinidos y planificar una semana entera con ellos.
- Elegir modo claro u oscuro, color de acento y fondo.

---

## 2. Pantallas

Navegación mediante una barra inferior con cuatro pestañas: **Hoy**, **Semana**, **Calendario** y **Ajustes**. El botón flotante **+** está disponible en todas.

### 2.1 Hoy

Cabecera con el título, la fecha completa y un botón redondo para alternar claro/oscuro. Debajo, un selector de dos vistas: **Agenda** y **Notas** (con su contador).

**Agenda**
- Siete botones **L M X J V S D**; al abrir queda marcado el día actual. Bajo su letra aparece un pequeño indicador (estrella por defecto), de un color distinto al acento; la forma se cambia en Ajustes.
- Si hay notas fijadas, aparecen primero en la sección **Fijadas**.
- Un resumen de notas por vencer (por ejemplo, "1 nota vence hoy · 1 vencida"); al tocarlo se abre la vista Notas. No aparece si no hay nada que resumir.
- Eventos del día elegido, de la hora más temprana a la más tardía, con su rango horario, título y nota. Los de una sola vez llevan la etiqueta **Una vez**; los que tienen aviso, una campana.
- Si se ve el día de hoy y la hora actual cae dentro de un evento (inicio incluido, fin excluido), ese evento se resalta con la etiqueta **Ahora**. Se actualiza cada minuto.
- Sin eventos: "Nada este día. Pulsa + para añadir."
- Tocar un evento abre su edición.

**Notas**
- Secciones: **Fijadas**, **Con fecha límite** y **Sin fecha límite**.
- Tocar una nota abre su edición.

### 2.2 Semana

- Muestra la semana actual con su rango de fechas y una tarjeta por día, de lunes a domingo (en pantallas anchas, dos columnas).
- Cada tarjeta indica el nombre del día y su cantidad de eventos y notas. El día actual lleva la etiqueta **Hoy** y un borde destacado.
- **Franja de ocupación**: barra de 24 horas con los tramos ocupados rellenos; los eventos que coinciden se superponen.
- Una fila por evento con hora de inicio, fin y título.
- Las notas con fecha límite aparecen en su día de vencimiento con su hora; si están vencidas, muestran "Vencida".
- Los días sin nada muestran **Libre**.
- Tocar la cabecera de un día lo abre en Hoy; tocar un evento o nota abre su edición.
- El botón **Planificar** abre la planificación de la semana (ver 7).

### 2.3 Calendario

- **Cabecera**: mes y año, con **‹** y **›** para cambiar de mes. El botón **Hoy** vuelve al mes actual y solo aparece cuando se está en otro.
- **Cuadrícula**: semanas en filas, columnas **L M X J V S D**. Los días de meses vecinos aparecen atenuados y al tocarlos se cambia de mes.
- Cada día muestra su número. Hoy lleva borde de acento y el día seleccionado, relleno de acento. Debajo del número: hasta tres puntos por eventos y un pequeño cuadrado por notas que vencen ese día (rojo si ya vencieron).
- **Detalle del día**: bajo la cuadrícula, la fecha completa con sus eventos y notas. Sin nada: "Nada este día."
- Los eventos indefinidos aparecen en todos los meses, en su día de la semana. Los de una sola vez, solo en su fecha.
- **Planificar** abre la planificación de la semana del día seleccionado.
- El botón **+** crea el evento en la fecha seleccionada; una nota nueva propone esa fecha como límite (se puede quitar).

### 2.4 Ajustes

Tarjetas, en este orden:
- **Modo**: Sistema, Claro u Oscuro.
- **Acento**: cinco colores predefinidos y un selector de **color libre**. Predefinidos: **Naranja** `#ff7a2f` (por defecto), **Blanco hielo** `#e6f2ff`, **Menta** `#7dffc4`, **Celeste** `#6fdcff` y **Rosa** `#ff8ec7`. Debajo se muestra el nombre y código del elegido.
- **Indicador del día actual**: forma que marca el día de hoy en la pantalla Hoy: **Estrella** (por defecto), **Rombo** o **Corazón**.
- **Fondo**: **Estándar**, el color liso del tema. La tarjeta admite más opciones de fondo.
- **Turnos**: lista de turnos guardados (hasta 12). Tocar uno lo edita; **+ Añadir turno** crea otro.
- **Avisos**: interruptor general, estado del permiso, próximos avisos y **Exportar .ics**.
- **Ayuda**: botón **Cómo usar**, que abre una guía rápida de la app.

Todas las elecciones se recuerdan al volver a abrir la app.

---

## 3. Botón +

Un único botón flotante en todas las pestañas:
1. Al pulsarlo, la pantalla se oscurece y el botón se convierte en una cruz.
2. Aparecen **Nueva nota** y **Nuevo evento**.
3. Elegir una abre su hoja de creación. Tocar fuera, la cruz o **Esc** cierra el menú.

Día y fecha por defecto: en Hoy y Semana, el día visto de la semana actual; en Calendario, el día seleccionado.

---

## 4. Eventos

La hoja se abre desde la parte inferior.

| Campo | Comportamiento |
|---|---|
| **Título** | Máx. 60 caracteres. Vacío → "Sin título". **Intro** guarda. |
| **Día** | Siete botones; viene marcado el día que se está viendo. |
| **Repetición** | **Indefinido** (por defecto) o **Por una vez**. Con **Por una vez** aparece el campo **Fecha** con el selector nativo: se puede elegir cualquier fecha desde el lunes de la semana actual en adelante. Al elegir la fecha se marca su día, y al elegir un día la fecha se mueve a ese día de la misma semana. Desde Calendario se propone la fecha seleccionada. |
| **Turnos** | Si existen, aparecen como botones; tocar uno rellena inicio y fin y, si el título está vacío, el nombre. |
| **Inicio / Fin** | Dos selectores de rueda (**I** y **F**). Horas 00–23, minutos de 5 en 5. |
| **Avisar** | Interruptor (apagado por defecto) y antelación: a la hora, 10 min, 30 min o 1 h antes. |
| **Nota** | Opcional, máx. 500 caracteres. |

Botones: **Guardar**, **Cancelar** (o tocar fuera) y **Borrar** (solo al editar).

**Indefinido y Por una vez**
- Indefinido: se repite todas las semanas.
- Por una vez: vale para la fecha elegida en el campo **Fecha** (semana actual o futuras). Se elimina al terminar su semana (el lunes siguiente a las 00:00).
- No se pueden crear ni planificar eventos de una sola vez en semanas ya pasadas.

**Reglas de las horas**
1. Los minutos son múltiplos de 5.
2. El fin debe ser posterior al inicio. Si al mover el inicio el fin queda igual o anterior, el fin pasa a una hora después; si al mover el fin queda igual o anterior al inicio, pasa a 5 minutos después.
3. Un evento no cruza la medianoche: el día termina a las **23:55** (inicio máximo 23:50).
4. Pueden coincidir varios eventos en el mismo horario.

**Aviso de fin de día**: al guardar un evento que llega hasta las 23:55 aparece un aviso con **Entendido** y **Crear ahora**, que abre el día siguiente de 00:00 a 01:00 con el mismo título.

---

## 5. Notas

| Campo | Comportamiento |
|---|---|
| **Título** | Opcional, máx. 60 caracteres. Vacío → "Sin título". |
| **Texto** | Hasta 2000 caracteres. |
| **Fecha límite** | Interruptor; al activarlo se elige la fecha con el selector nativo. |
| **Hora límite** | Selector de rueda. Si no se cambia, vence a las 23:55. |
| **Fijar en Hoy** | Interruptor (ver 6). |
| **Avisar** | Interruptor (apagado por defecto) y antelación: a la hora, 10 min, 1 h o 1 día antes. Solo con fecha límite. |

Botones: **Guardar**, **Cancelar** y **Borrar** (solo al editar).

**Estado de una nota con límite**
- **Vence en…** (tiempo restante), **Vence hoy · hora** (resaltada) o **Vencida · hace…** (en rojo).
- Una nota vencida no se borra sola: permanece hasta que se edite o se borre. Si se cambia la fecha, deja de estar vencida.
- Una nota sin límite se muestra como **Indefinida** y permanece hasta que se borre.

**Orden en la vista Notas**
- Con límite: vencidas primero, luego de la fecha más cercana a la más lejana.
- Sin límite: por última edición, la más reciente primero.

Las etiquetas de tiempo se actualizan cada minuto mientras la app está visible. Máximo 200 notas.

---

## 6. Fijar notas en Hoy

Una nota fijada queda a la vista arriba de **Hoy → Agenda**, sea cual sea el día elegido.

- **Cómo se fija**: con el botón de chincheta de la vista Notas, o con el interruptor **Fijar en Hoy** de la hoja de nota.
- **Qué se muestra**: sección **Fijadas** con tarjetas compactas (chincheta, título, etiqueta de límite y campana si tiene aviso). Tocar la tarjeta abre la nota. Sin fijadas, la sección no aparece.
- Las fijadas también siguen en la vista Notas, marcadas con la chincheta rellena.
- **Máximo 3**. Al intentar fijar una cuarta, un aviso indica que hay que soltar una antes.
- **Orden**: vencidas primero, luego por fecha límite; las indefinidas, de la fijada más recientemente a la más antigua.
- Una nota fijada que vence sigue fijada y se marca **Vencida**. Borrarla la quita de la sección.

---

## 7. Turnos y planificación

Los **turnos** son horarios con nombre (por ejemplo, "Mañana 06:00–14:00"). Se crean, editan y borran en Ajustes; en la hoja de evento, tocar uno rellena las horas.

**Planificar semana**: desde Semana (semana actual) o Calendario (semana del día seleccionado), una hoja con los siete días, cada uno con un turno o **Libre**. Se elige **Indefinido** o **Por una vez** y al aplicar se crea un evento por cada día con turno.
- Un plan reemplaza solo los eventos creados por planes anteriores del mismo tipo (y de la misma semana si es de una vez). Los eventos manuales no se tocan.
- Si se edita a mano un evento de plan, pasa a contar como manual.
- Si un turno termina a las 23:55 se muestra un único aviso con la lista de esos días.
- Un turno que cruza la medianoche se maneja como dos: uno hasta 23:55 y otro desde 00:00 del día siguiente.
- No se puede planificar de una sola vez en semanas pasadas.

---

## 8. Avisos

Cada evento y cada nota con límite tiene su propio aviso, apagado por defecto. Un evento indefinido avisa cada semana en su día y hora; uno de una sola vez, en su fecha; una nota, antes de su límite.

**Cómo se avisa**
1. **Con la app abierta**: aviso emergente dentro de la app. Si hay permiso de notificaciones y la app está en segundo plano pero activa, se envía también una notificación del sistema. Es un esfuerzo razonable, sin garantía: el sistema puede suspender la app.
2. **Avisos perdidos**: al abrir la app se listan los avisos de las últimas 24 horas que no se llegaron a ver.
3. **Calendario del teléfono**: **Exportar .ics** genera un archivo con los eventos y notas con aviso activo (los indefinidos como repetición semanal). Al abrirlo, el calendario del teléfono los añade con su alarma y avisa aunque la app esté cerrada. Es de un solo sentido: los cambios posteriores requieren exportar de nuevo.

**En Ajustes → Avisos**
- **Permitir avisos**: interruptor general.
- Estado del permiso y botón para solicitarlo (siempre tras un toque del usuario).
- **Próximos avisos**: los de los próximos 7 días, cada uno con interruptor y antelación.

**Límites**: sin servidor, la app cerrada no puede avisar por sí sola (para eso sirve el calendario del teléfono). Las notificaciones del sistema requieren HTTPS y, en iPhone, que la app esté instalada en la pantalla de inicio (iOS 16.4 o posterior).

---

## 9. Tema, acento y fondos

**Modo**: el modo claro usa grises neutros, sin blanco puro, para una vista menos brillante. Sin elección manual sigue la preferencia del sistema y cambia en vivo. Con **Claro**, **Oscuro** o el botón de Hoy, se fija esa elección.

**Acento**: colorea botones principales, día seleccionado, etiquetas, interruptores, iconos activos, bordes destacados, enlaces y la franja de ocupación. Se guarda en el dispositivo y se aplica antes de pintar la pantalla.

**Contraste dinámico**: al elegir un acento (predefinido o libre), la app calcula para cada modo:
- El **relleno**. En oscuro es el color elegido; en claro se oscurece lo mínimo necesario para destacar al menos 3:1 sobre el fondo.
- El **texto sobre el acento**: oscuro o blanco, el que dé al menos 4.5:1.
- El **acento como texto/icono/borde**: el color acercado al blanco (oscuro) o al negro (claro) hasta lograr 4.5:1.

**Indicador del día actual**: usa un color propio (dorado, ajustado a cada modo para tener al menos 3:1), distinto del acento.

**Fondo**: Estándar, el color liso del tema. Tarjetas, barra inferior y hojas tienen fondo sólido, así que el texto siempre se lee sobre color liso.

---

## 10. Datos

Todo se guarda en `localStorage`. Al leer se valida cada elemento y se descarta lo dañado sin romper la app.

| Clave | Contenido |
|---|---|
| `horario:eventos` | Eventos |
| `horario:notas` | Notas |
| `horario:turnos` | Turnos |
| `horario:avisos` | Interruptor general, última revisión y avisos ya mostrados |
| `horario:fondo`, `horario:modo`, `horario:acento`, `horario:acento-vars`, `horario:indicador` | Apariencia |

---

## 11. Accesibilidad y seguridad

- Icono de la app en `img/icono.svg`; el resto de iconos son SVG en línea que heredan el color del tema, todos con `aria-label`.
- Solo fuentes del sistema.
- Contraste mínimo de 4.5:1 en texto, en ambos modos y con cualquier acento; contornos de controles de al menos 3:1.
- Ventanas (hojas, menú +, avisos) como diálogos modales: foco contenido, **Esc** cierra y el foco regresa a quien las abrió.
- Interruptores con `role="switch"`, chinchetas con `aria-pressed` y estados con texto, no solo color.
- Áreas seguras (notch y barra inferior) y objetivos táctiles de al menos 44 px.
- Campos de texto con letra de al menos 16 px y sin zoom automático al abrir el teclado.
- Transiciones breves que se desactivan con `prefers-reduced-motion`.
- El texto del usuario se inserta siempre como texto, nunca como HTML. Política de seguridad de contenido: solo recursos propios, sin peticiones de red ni código de terceros.

---

## 12. Instalación

- Requiere **HTTPS** (o `localhost`); los módulos JavaScript no cargan abriendo `index.html` desde el disco.
- **iPhone**: Safari → Compartir → "Añadir a pantalla de inicio".
- **Android**: Chrome → menú → "Instalar aplicación".
- Tras la primera carga funciona sin conexión.
