/* =========================================================
   app.js — DOM, eventos (callbacks) y estados de UI
   EF-01: búsqueda por ingrediente
   EF-02: visualización de resultados
   EF-03: selección de una receta
   EF-04: asignación a un día
   EF-08: manejo de errores
   EF-11: callbacks con addEventListener
   ========================================================= */

// ---------- Selección de elementos del DOM ----------
const formularioBusqueda = document.getElementById("formulario-busqueda");
const inputIngrediente = document.getElementById("ingrediente");
const botonBuscar = document.getElementById("btn-buscar");
const mensajeEstado = document.getElementById("mensaje-estado");
const rejillaResultados = document.getElementById("rejilla-resultados");
const panelDetalle = document.getElementById("panel-detalle");
const detalleReceta = document.getElementById("detalle-receta");
const botonCerrarDetalle = document.getElementById("btn-cerrar-detalle");
const calendario = document.getElementById("calendario");
const mensajePlan = document.getElementById("mensaje-plan");

// Receta actualmente seleccionada (RF04)
let recetaSeleccionada = null;

// ---------- Estados de UI ----------
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensaje mensaje-${tipo}`;
}

function mostrarCargando() {
  mostrarMensaje(mensajeEstado, "Cargando recetas…", "cargando");
  rejillaResultados.classList.add("hidden");
  botonBuscar.disabled = true;
}

function habilitarBusqueda() {
  botonBuscar.disabled = false;
}

function mostrarResultados(recetas, ingrediente) {
  mostrarMensaje(
    mensajeEstado,
    `Se encontraron ${recetas.length} recetas con «${ingrediente}».`,
    "info",
  );
  renderTarjetas(recetas);
  rejillaResultados.classList.remove("hidden");
}

function mostrarSinResultados(ingrediente) {
  mostrarMensaje(
    mensajeEstado,
    `No se encontraron recetas con «${ingrediente}». Prueba con otro ingrediente.`,
    "info",
  );
  rejillaResultados.classList.add("hidden");
}

function mostrarErrorBusqueda() {
  // EF-08: estado de error cuando Fetch falla (red caída, API fuera)
  mostrarMensaje(
    mensajeEstado,
    "No se pudieron cargar las recetas. Revisa tu conexión e inténtalo de nuevo.",
    "error",
  );
  rejillaResultados.classList.add("hidden");
}

// ---------- RF03/EF-02: render de tarjetas de resultados ----------
function renderTarjetas(recetas) {
  // EF-12: limpiar y reconstruir la rejilla con elementos del DOM
  rejillaResultados.innerHTML = "";

  recetas.forEach((receta) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const imagen = document.createElement("img");
    imagen.className = "tarjeta-img";
    imagen.src = receta.imagen;
    imagen.alt = receta.nombre;
    imagen.loading = "lazy";

    const cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta-cuerpo";

    const titulo = document.createElement("h3");
    titulo.textContent = receta.nombre;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "tarjeta-boton";
    boton.textContent = "Ver detalle";
    boton.dataset.id = receta.id;
    boton.setAttribute("aria-label", `Ver detalle de ${receta.nombre}`);

    cuerpo.append(titulo, boton);
    tarjeta.append(imagen, cuerpo);
    rejillaResultados.appendChild(tarjeta);
  });
}

// ---------- EF-11: callback de selección de receta (EF-03) ----------
rejillaResultados.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".tarjeta-boton");
  if (!boton) return;
  verDetalle(boton.dataset.id);
});

function verDetalle(id) {
  panelDetalle.classList.remove("hidden");
  recetaSeleccionada = null;

  // Estado cargando mientras llega el detalle
  detalleReceta.innerHTML = "";
  const cargando = document.createElement("p");
  cargando.className = "mensaje mensaje-cargando";
  cargando.textContent = "Cargando detalle…";
  detalleReceta.appendChild(cargando);

  panelDetalle.scrollIntoView({ behavior: "smooth", block: "start" });

  // Segundo Fetch: trae categoría, área, ingredientes e instrucciones
  obtenerDetalleReceta(id)
    .then((receta) => {
      recetaSeleccionada = receta;
      renderizarDetalle(receta);
    })
    .catch((error) => {
      // EF-08: si falla el detalle, mostramos error dentro del panel
      console.error("Error al cargar el detalle:", error);
      detalleReceta.innerHTML = "";
      const aviso = document.createElement("p");
      aviso.className = "mensaje mensaje-error";
      aviso.textContent =
        "No se pudo cargar el detalle de la receta. Inténtalo de nuevo.";
      detalleReceta.appendChild(aviso);
    });
}

function renderizarDetalle(receta) {
  detalleReceta.innerHTML = "";

  const contenedor = document.createElement("article");
  contenedor.className = "detalle";

  const imagen = document.createElement("img");
  imagen.className = "detalle-imagen";
  imagen.src = receta.imagen;
  imagen.alt = `Foto de ${receta.nombre}`;

  const info = document.createElement("div");
  info.className = "detalle-info";

  // Nombre, categoría, área/origen e identificador (datos 4.5)
  const titulo = document.createElement("h3");
  titulo.className = "detalle-titulo";
  titulo.textContent = receta.nombre;

  const etiquetas = document.createElement("p");
  etiquetas.className = "detalle-etiquetas";
  etiquetas.append(
    crearEtiqueta(`Categoría: ${receta.categoria}`),
    crearEtiqueta(`Origen: ${receta.area}`),
    crearEtiqueta(`ID: ${receta.id}`),
  );

  const hIngredientes = document.createElement("h4");
  hIngredientes.textContent = "Ingredientes";

  const lista = document.createElement("ul");
  lista.className = "lista-ingredientes";
  receta.ingredientes.forEach((ing) => {
    const item = document.createElement("li");
    item.textContent = ing.medida
      ? `${ing.medida} — ${ing.nombre}`
      : ing.nombre;
    lista.appendChild(item);
  });

  const hInstrucciones = document.createElement("h4");
  hInstrucciones.textContent = "Instrucciones";

  const parrafo = document.createElement("p");
  parrafo.className = "detalle-instrucciones";
  parrafo.textContent = receta.instrucciones;

  // RF05: formulario para elegir día y agregar al plan
  const formulario = crearFormularioAsignacion();

  const aviso = document.createElement("p");
  aviso.id = "aviso-asignacion";
  aviso.className = "mensaje hidden";
  aviso.setAttribute("role", "status");

  info.append(
    titulo,
    etiquetas,
    hIngredientes,
    lista,
    hInstrucciones,
    parrafo,
    formulario,
    aviso,
  );
  contenedor.append(imagen, info);
  detalleReceta.appendChild(contenedor);
}

function crearEtiqueta(texto) {
  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = texto;
  return etiqueta;
}

function crearFormularioAsignacion() {
  const formulario = document.createElement("form");
  formulario.className = "asignar";
  formulario.id = "formulario-asignar";

  const campo = document.createElement("div");
  campo.className = "campo";

  const etiqueta = document.createElement("label");
  etiqueta.setAttribute("for", "selector-dia");
  etiqueta.textContent = "Día de la semana";

  const selector = document.createElement("select");
  selector.id = "selector-dia";
  DIAS_SEMANA.forEach((dia) => {
    const opcion = document.createElement("option");
    opcion.value = dia;
    opcion.textContent = capitalizar(dia);
    selector.appendChild(opcion);
  });

  const boton = document.createElement("button");
  boton.type = "submit";
  boton.className = "boton";
  boton.textContent = "Agregar al plan";

  campo.append(etiqueta, selector);
  formulario.append(campo, boton);

  // EF-11: callback del evento submit (RF05)
  formulario.addEventListener("submit", alAsignarReceta);

  return formulario;
}

// ---------- EF-04: asignación de la receta a un día elegido ----------
function alAsignarReceta(evento) {
  evento.preventDefault();

  const aviso = document.getElementById("aviso-asignacion");
  if (!recetaSeleccionada || !aviso) return;

  const dia = document.getElementById("selector-dia").value;
  const resultado = agregarRecetaAlDia(dia, recetaSeleccionada);

  if (resultado.ok) {
    renderizarPlanSemanal();
    mostrarMensaje(
      aviso,
      `✔ «${recetaSeleccionada.nombre}» se agregó al menú del ${dia}.`,
      "exito",
    );
  } else {
    // Regla: no repetir la misma receta en el mismo día
    mostrarMensaje(aviso, `⚠ ${resultado.motivo}`, "aviso");
  }
}

// ---------- EF-11: callbacks de la interfaz ----------
// RF01/RF02: búsqueda con Fetch + Promesa
formularioBusqueda.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const ingrediente = inputIngrediente.value.trim();
  if (ingrediente === "") {
    mostrarMensaje(
      mensajeEstado,
      "Escribe un ingrediente, por ejemplo: chicken.",
      "aviso",
    );
    inputIngrediente.focus();
    return;
  }

  ocultarDetalle();
  mostrarCargando();

  buscarPorIngrediente(ingrediente)
    .then((recetas) => {
      habilitarBusqueda();
      if (recetas.length === 0) {
        mostrarSinResultados(ingrediente);
      } else {
        mostrarResultados(recetas, ingrediente);
      }
    })
    .catch((error) => {
      // EF-08: Fetch falló (red o API)
      console.error("Error en la búsqueda:", error);
      habilitarBusqueda();
      mostrarErrorBusqueda();
    });
});

// Cerrar panel de detalle
botonCerrarDetalle.addEventListener("click", ocultarDetalle);

function ocultarDetalle() {
  panelDetalle.classList.add("hidden");
  recetaSeleccionada = null;
}

// EF-11: delegación de eventos para acciones del menú semanal
calendario.addEventListener("click", (evento) => {
  const botonDetalle = evento.target.closest(".boton-detalle-plan");
  if (botonDetalle) {
    verDetalle(botonDetalle.dataset.id);
    return;
  }

  const botonEliminar = evento.target.closest(".boton-eliminar");
  if (!botonEliminar) return;

  const dia = botonEliminar.dataset.dia;
  const id = botonEliminar.dataset.id;
  const receta = obtenerPlanSemanal()[dia].find((r) => r.id === id);

  if (eliminarRecetaDelDia(dia, id)) {
    renderizarPlanSemanal();
    if (mensajePlan) {
      mostrarMensaje(
        mensajePlan,
        receta
          ? `Se eliminó «${receta.nombre}» del ${dia}.`
          : `Se eliminó la receta del ${dia}.`,
        "info",
      );
    }
  }
});

// ---------- Inicialización ----------
renderizarPlanSemanal();
