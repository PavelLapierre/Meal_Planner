# 🍽️ Meal Planner — Planificador semanal de comidas

Aplicación web para **buscar recetas por ingrediente** y **organizar un menú semanal**.
Desarrollada con HTML5, CSS3 y JavaScript (vanilla) aplicando DOM, eventos, funciones,
callbacks, Promesas y Fetch sobre una API pública (TheMealDB).

---

## ▶️ Cómo ejecutar el proyecto

```bash
node server.js
# → http://localhost:8080
```

> Se incluye `server.js` (servidor estático mínimo) porque abrir `index.html` con
> `file://` puede bloquear las peticiones Fetch por CORS. Con el servidor local todo funciona.

---

## ❓ Problema que resuelve

Los estudiantes pueden utilizar una aplicación sencilla para **buscar recetas** y
organizar una **planificación semanal de comidas**, sin depender de hojas de cálculo
ni de recordar qué cocinar cada día.

## 🎯 Objetivo de aprendizaje

Aplicar de forma integrada **DOM, eventos, funciones JavaScript, callbacks, Promesas
y Fetch**, construyendo una aplicación interactiva basada en datos externos.

---

## 📂 Estructura de archivos

```
meal-planner/
│
├── index.html          # Formulario, resultados y planificación
├── css/
│   └── estilos.css     # Tarjetas, calendario semanal y estados
├── js/
│   ├── app.js          # Lógica de búsqueda y planificación + callbacks
│   ├── api.js          # Consulta de recetas (Fetch + Promesas)
│   └── planner.js      # Estado del plan y render del calendario (DOM)
├── server.js           # Servidor estático para ejecutar en local
├── evidencias/         # Capturas de pantalla de cada evidencia
└── README.md
```

---

## 🧩 Funcionalidades principales

| # | Funcionalidad |
|---|----------------|
| 1 | Buscar recetas por ingrediente |
| 2 | Mostrar nombre, categoría e imagen |
| 3 | Visualizar información básica de una receta |
| 4 | Agregar una receta a un día de la semana |
| 5 | Eliminar una receta del plan |
| 6 | Mostrar el menú semanal |
| 7 | Gestionar estados de carga, resultados y errores |

## 📦 Datos que se gestionan

Ingrediente · Nombre de receta · Categoría · Área/origen · Imagen · Identificador ·
Día de la semana · Receta seleccionada · Plan semanal.

---

## 🔌 API pública: TheMealDB

Se usa la API sugerida **TheMealDB** (gratuita, sin clave, con CORS abierto).
Endpoints utilizados:

| Endpoint | Uso |
|----------|-----|
| `https://www.themealdb.com/api/json/v1/1/filter.php?i=<ingrediente>` | Búsqueda por ingrediente (RF02) |
| `https://www.themealdb.com/api/json/v1/1/lookup.php?i=<id>` | Detalle: categoría, área, ingredientes, instrucciones (RF04) |

> **Nota:** `filter.php` solo devuelve `idMeal`, `strMeal` y `strMealThumb`; la
> **categoría** y el **área** se obtienen con el segundo Fetch (`lookup.php`).

---

## ✅ Requisitos funcionales

| RF | Implementación | Archivo |
|----|----------------|---------|
| RF01. Introducir un ingrediente | Formulario con input y botón | `index.html` |
| RF02. Consultar recetas mediante Fetch | `buscarPorIngrediente()` con `fetch` | `js/api.js` |
| RF03. Mostrar las recetas encontradas | `renderTarjetas()` crea las tarjetas | `js/app.js` |
| RF04. Seleccionar una receta | Clic en tarjeta → `obtenerDetalleReceta()` (2.º Fetch) | `js/app.js` |
| RF05. Asignar a un día de la semana | `agregarRecetaAlDia()` con validación de duplicado | `js/planner.js` |
| RF06. Mostrar el menú semanal | `renderizarPlanSemanal()` pinta los 7 días | `js/planner.js` |
| RF07. Eliminar recetas del menú | `eliminarRecetaDelDia()` + delegación de eventos | `js/planner.js` / `js/app.js` |

---

## 🛠️ Requisitos técnicos (dónde está cada uno)

| Tecnología | Dónde se aplica |
|------------|-----------------|
| **HTML5** | `index.html`: `form`, resultados, detalle y planificación (`section`, `main`, `header`, `footer`) |
| **CSS3** | `css/estilos.css`: tarjetas, grid del calendario semanal, estados y `@media` responsive |
| **JavaScript** | Variables, funciones, `if`, `forEach`, `map`, `filter`, `some`, objetos y arrays |
| **DOM** | `createElement`, `appendChild/append`, `innerHTML`, `textContent`, `dataset`, `classList` |
| **Callbacks** | `addEventListener('submit'/'click')` en `app.js` (EF-11) |
| **Promesas** | `fetch().then().then()` y encadenamiento en `api.js`; `.catch()` en `app.js` (EF-10) |
| **Fetch** | `filter.php` (búsqueda) y `lookup.php` (detalle) en `api.js` (EF-09) |
| **Estados UI** | `mostrarCargando`, `mostrarResultados`, `mostrarSinResultados`, `mostrarErrorBusqueda` |
| **Manejo de errores** | `if (!respuesta.ok) throw`, `.catch()`, `try/catch` en `localStorage` (EF-08) |

---

## 🔄 Flujo general

```
Usuario introduce ingrediente
        ↓
   Fetch (filter.php)
        ↓
   Promesa (.then)
        ↓
   Resultados (tarjetas)
        ↓
   Selección de receta  →  Fetch (lookup.php)  →  Detalle
        ↓
   Selección de día  →  agregarRecetaAlDia()
        ↓
   Actualización del DOM (renderizarPlanSemanal)
        ↓
   Menú semanal  →  localStorage
```

---

## 🧾 Evidencias (4.11)

| Evidencia | Cómo se demuestra | Ubicación |
|-----------|-------------------|-----------|
| Búsqueda por ingrediente | Escribir ingrediente → clic «Buscar recetas» | `app.js` → callback `submit` |
| Visualización de resultados | Rejilla de tarjetas (nombre + imagen) | `app.js` → `renderTarjetas()` |
| Selección de una receta | Clic «Ver detalle» → panel con categoría/área | `app.js` → `verDetalle()` |
| Asignación a un día | Elegir día → «Agregar al plan» → aviso de éxito | `app.js` → `alAsignarReceta()` |
| Visualización del menú semanal | Calendario con los 7 días y sus recetas | `planner.js` → `renderizarPlanSemanal()` |
| Eliminación de una receta | Botón «Eliminar» dentro de cada día | `planner.js` → `eliminarRecetaDelDia()` |
| Consulta sin resultados | Buscar un ingrediente inexistente (p. ej. `zzz`) → estado vacío | `api.js` (`meals: null` → `[]`) |
| Manejo de errores | Cerrar la red o apagar el servidor → estado de error | `app.js` → `mostrarErrorBusqueda()` |
| Identificación de Fetch | `fetch(...)` en `api.js` (líneas de `filter.php` y `lookup.php`) | EF-09 |
| Identificación de Promesas | `return fetch().then().then()` y `.catch()` | EF-10 |
| Identificación de callbacks | `addEventListener('submit'/'click', función)` | EF-11 |
| Explicación de la actualización del DOM | `renderTarjetas()` y `renderizarPlanSemanal()` crean/modifican/eliminan nodos | EF-12 |

> Cada evidencia está marcada en el código con comentarios `EF-01` … `EF-12`.
> Las capturas de pantalla se encuentran en la carpeta [`evidencias/`](evidencias/).

---

## ❓ Preguntas técnicas (4.12)

**¿Qué información devuelve la API?**
`filter.php` devuelve un objeto con `meals`: array de `{ idMeal, strMeal, strMealThumb }`
(nombre, identificador e imagen). `lookup.php` devuelve el objeto completo con
`strCategory`, `strArea`, `strIngredient1..20`, `strMeasure1..20` y `strInstructions`.

**¿Cómo se convierte la respuesta en datos utilizables?**
Con `normalizarReceta()` en `api.js`: se recorren las 20 columnas de ingredientes y
medidas, y se devuelve un objeto limpio `{ id, nombre, categoria, area, imagen,
ingredientes[], instrucciones }`. El listado se transforma con `.map()`.

**¿Cómo se genera una tarjeta de receta?**
En `renderTarjetas()` (`app.js`) se recorre el array con `forEach` y por cada receta se
usan `document.createElement('article'/'img'/'h3'/'button')`, se rellena con
`textContent`/`src` y se añade a la rejilla con `appendChild()`.

**¿Cómo se agrega una receta al día seleccionado?**
El formulario del detalle dispara `alAsignarReceta()` (callback), que lee el `<select>`
y llama a `agregarRecetaAlDia(día, receta)`. La función valida el día, comprueba que la
receta no esté repetida en ese día, hace `push()` al plan, guarda en `localStorage` y
vuelve a pintar el calendario.

**¿Cómo se elimina?**
Cada receta del calendario tiene un botón «Eliminar» con `data-dia` y `data-id`. Un
evento `click` **delegado** en `#calendario` (`app.js`) detecta el botón y llama a
`eliminarRecetaDelDia()`, que filtra el array con `.filter()` y repinta el DOM.

**¿Dónde está el callback de un evento?**
En `app.js`: `formularioBusqueda.addEventListener('submit', …)`,
`rejillaResultados.addEventListener('click', …)`, `botonCerrarDetalle.addEventListener(…)`
y `calendario.addEventListener('click', …)`. También `formulario.addEventListener('submit', alAsignarReceta)`.

**¿Dónde se utiliza una Promesa?**
En `api.js`: `buscarPorIngrediente()` y `obtenerDetalleReceta()` devuelven la Promesa de
`fetch()` encadenada con `.then()`. El consumidor (`app.js`) la encadena con `.then()` y
`.catch()`. También el `.json()` interno es una Promesa.

**¿Qué sucede si Fetch falla?**
La Promesa se **rechaza**. Si la respuesta HTTP no es `ok`, lanzamos `throw new Error(...)`;
si falla la red, `fetch` rechaza automáticamente. En ambos casos el `.catch()` de `app.js`
ejecuta `mostrarErrorBusqueda()` y se muestra el estado de error en la UI.

**¿Cómo impedirías dos recetas en el mismo día?**
El diseño permite **varias recetas por día**, por lo que la validación implementada es
evitar la **receta duplicada en el mismo día**: antes de agregar se consulta
`plan[día].some(r => r.id === nueva.id)` en `recetaYaEnElDia()`. Si se quisiera limitar a
una receta por día, sería añadir un `if (plan[día].length > 0) return …` antes del `push()`.

---

## 📊 Rúbrica — mapa de evidencias por criterio

| Criterio | Peso | Dónde demostrarlo |
|----------|------|-------------------|
| 1. Funcionamiento y demostración | 25% | Demo en vivo de las 12 evidencias |
| 2. Conocimiento de HTML y CSS | 15% | `index.html` + `css/estilos.css` |
| 3. Conocimiento de JavaScript | 15% | Funciones, control de flujo y eventos en `js/` |
| 4. Manipulación del DOM | 15% | `renderTarjetas()` y `renderizarPlanSemanal()` |
| 5. JavaScript asincrónico | 15% | `api.js` (Fetch/Promesas) + callbacks |
| 6. Comprensión global | — | Arquitectura en 3 módulos (api / planner / app) |
