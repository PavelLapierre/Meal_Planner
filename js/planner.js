/* =========================================================
   planner.js — Estado del plan semanal y render en el DOM
   RF05: asignar receta a un día (válido si no está repetida)
   RF06: mostrar el menú semanal
   RF07: eliminar recetas del menú
   EF-05/EF-12: creación y modificación de elementos del DOM
   ========================================================= */

const DIAS_SEMANA = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const CLAVE_STORAGE = "mealPlanner:plan";

// Estado en memoria: { lunes: [receta, ...], martes: [...], ... }
let planSemanal = cargarPlanDesdeStorage();

function crearPlanVacio() {
  const plan = {};
  DIAS_SEMANA.forEach((dia) => {
    plan[dia] = [];
  });
  return plan;
}

// Persistencia con localStorage (sobrevive al recargar la página)
function cargarPlanDesdeStorage() {
  try {
    const crudo = localStorage.getItem(CLAVE_STORAGE);
    if (!crudo) return crearPlanVacio();

    const guardado = JSON.parse(crudo);
    const plan = crearPlanVacio();
    DIAS_SEMANA.forEach((dia) => {
      if (Array.isArray(guardado[dia])) {
        plan[dia] = guardado[dia];
      }
    });
    return plan;
  } catch (error) {
    // EF-08: si el dato está corrupto, empezamos de cero
    console.warn("No se pudo leer el plan guardado:", error);
    return crearPlanVacio();
  }
}

function guardarPlanEnStorage() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(planSemanal));
  } catch (error) {
    // EF-08: localStorage puede fallar si está lleno o bloqueado
    console.warn("No se pudo guardar el plan:", error);
  }
}

function obtenerPlanSemanal() {
  return planSemanal;
}

function recetaYaEnElDia(dia, idReceta) {
  return planSemanal[dia].some((receta) => receta.id === idReceta);
}

/**
 * RF05: Agrega una receta a un día.
 * Regla de negocio: se permite varias receta por día,
 * pero NO la misma receta repetida dentro de un mismo día.
 * Devuelve { ok: true } o { ok: false, motivo }
 */
function agregarRecetaAlDia(dia, receta) {
  if (!DIAS_SEMANA.includes(dia)) {
    return { ok: false, motivo: "Día inválido." };
  }

  if (recetaYaEnElDia(dia, receta.id)) {
    return {
      ok: false,
      motivo: `«${receta.nombre}» ya está en el menú del ${dia}.`,
    };
  }

  // Solo guardamos lo necesario para el calendario (imagen, nombre, id)
  planSemanal[dia].push({
    id: receta.id,
    nombre: receta.nombre,
    imagen: receta.imagen,
  });

  guardarPlanEnStorage();
  return { ok: true };
}

/**
 * RF07: Elimina una receta concreta de un día (no el día completo).
 */
function eliminarRecetaDelDia(dia, idReceta) {
  if (!DIAS_SEMANA.includes(dia)) return false;

  planSemanal[dia] = planSemanal[dia].filter(
    (receta) => receta.id !== idReceta,
  );

  guardarPlanEnStorage();
  return true;
}

function contarRecetasDelPlan() {
  return DIAS_SEMANA.reduce((total, dia) => total + planSemanal[dia].length, 0);
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * EF-05/EF-12: Actualiza el DOM del calendario semanal.
 * Se reconstruyen las tarjetas de cada día a partir del estado.
 */
function renderizarPlanSemanal() {
  const calendario = document.getElementById("calendario");
  if (!calendario) return;

  // Limpiar y volver a crear los 7 días
  calendario.innerHTML = "";
  DIAS_SEMANA.forEach((dia) => {
    calendario.appendChild(crearTarjetaDia(dia));
  });
}

function crearTarjetaDia(dia) {
  const recetas = planSemanal[dia];

  // EF-12: creación de elementos con document.createElement
  const tarjeta = document.createElement("div");
  tarjeta.className = "dia";
  tarjeta.dataset.dia = dia;

  const cabecera = document.createElement("div");
  cabecera.className = "dia-cabecera";

  const titulo = document.createElement("h3");
  titulo.textContent = capitalizar(dia);

  const contador = document.createElement("span");
  contador.className = "dia-contador";
  contador.textContent =
    recetas.length === 1 ? "1 receta" : `${recetas.length} recetas`;

  cabecera.append(titulo, contador);
  tarjeta.appendChild(cabecera);

  if (recetas.length === 0) {
    // Estado vacío por día
    const vacio = document.createElement("p");
    vacio.className = "dia-vacio";
    vacio.textContent = "Sin recetas asignadas";
    tarjeta.appendChild(vacio);
  } else {
    const lista = document.createElement("ul");
    lista.className = "dia-lista";
    recetas.forEach((receta) => {
      lista.appendChild(crearItemReceta(dia, receta));
    });
    tarjeta.appendChild(lista);
  }

  return tarjeta;
}

function crearItemReceta(dia, receta) {
  const item = document.createElement("li");
  item.className = "dia-receta";

  const imagen = document.createElement("img");
  imagen.className = "dia-receta-imagen";
  imagen.src = receta.imagen;
  imagen.alt = receta.nombre;
  imagen.loading = "lazy";

  const contenido = document.createElement("div");
  contenido.className = "dia-receta-contenido";

  const nombre = document.createElement("span");
  nombre.className = "dia-receta-nombre";
  nombre.textContent = receta.nombre;

  const acciones = document.createElement("div");
  acciones.className = "dia-receta-acciones";

  const botonDetalle = document.createElement("button");
  botonDetalle.type = "button";
  botonDetalle.className = "boton-detalle-plan";
  botonDetalle.textContent = "Ver detalle";
  botonDetalle.dataset.id = receta.id;
  botonDetalle.setAttribute(
    "aria-label",
    `Ver detalle de ${receta.nombre} del ${dia}`,
  );

  // RF07: botón de eliminar con datos para el delegado de eventos
  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "boton-eliminar";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.dataset.dia = dia;
  botonEliminar.dataset.id = receta.id;
  botonEliminar.setAttribute(
    "aria-label",
    `Eliminar ${receta.nombre} del ${dia}`,
  );

  acciones.append(botonDetalle, botonEliminar);
  contenido.appendChild(nombre);
  item.append(imagen, contenido, acciones);
  return item;
}
