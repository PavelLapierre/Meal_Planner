/* =========================================================
   api.js — Consulta de recetas (TheMealDB)
   EF-09: Fetch        → peticiones HTTP
   EF-10: Promesas     → encadenamiento .then / .catch
   EF-07: sin resultados → meals: null se convierte en []
   EF-08: manejo de errores → respuestas HTTP fallidas
   ========================================================= */

// Endpoint público de TheMealDB (no requiere clave)
const URL_API = "https://www.themealdb.com/api/json/v1/1";

/**
 * EF-09/EF-10: Busca recetas por ingrediente.
 * Devuelve una Promesa que resuelve con una lista normalizada:
 * [{ id, nombre, imagen }]
 */
function buscarPorIngrediente(ingrediente) {
  const consulta = `${URL_API}/filter.php?i=${encodeURIComponent(ingrediente.trim())}`;

  // fetch() devuelve una Promesa que se encadena con .then()
  return fetch(consulta)
    .then((respuesta) => {
      // EF-08: si la API responde con error HTTP, lanzamos una excepción
      if (!respuesta.ok) {
        throw new Error(`La API respondió con estado ${respuesta.status}`);
      }
      // .json() también devuelve una Promesa
      return respuesta.json();
    })
    .then((datos) => {
      // EF-07: la API devuelve meals: null cuando no hay coincidencias
      const comidas = Array.isArray(datos.meals) ? datos.meals : [];
      return comidas.map((meal) => ({
        id: meal.idMeal,
        nombre: meal.strMeal,
        imagen: meal.strMealThumb,
      }));
    });
  // El error queda rechazado para que app.js lo capture con .catch()
}

/**
 * EF-09/EF-10: Obtiene el detalle completo de una receta por su identificador.
 * Devuelve una Promesa que resuelve con la receta normalizada:
 * { id, nombre, categoria, area, imagen, ingredientes[], instrucciones }
 */
function obtenerDetalleReceta(id) {
  const consulta = `${URL_API}/lookup.php?i=${encodeURIComponent(id)}`;

  return fetch(consulta)
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`La API respondió con estado ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((datos) => {
      if (!Array.isArray(datos.meals) || datos.meals.length === 0) {
        throw new Error("No se encontró la receta solicitada");
      }
      return normalizarReceta(datos.meals[0]);
    });
}

/**
 * Convierte la respuesta cruda de la API en un objeto utilizable.
 * TheMealDB guarda los ingredientes en columnas strIngredient1..20
 * y las medidas en strMeasure1..20.
 */
function normalizarReceta(meal) {
  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const nombre = (meal[`strIngredient${i}`] || "").trim();
    if (nombre !== "") {
      ingredientes.push({
        nombre,
        medida: (meal[`strMeasure${i}`] || "").trim(),
      });
    }
  }

  return {
    id: meal.idMeal,
    nombre: meal.strMeal,
    categoria: meal.strCategory || "Sin categoría",
    area: meal.strArea || "Sin origen",
    imagen: meal.strMealThumb,
    ingredientes,
    instrucciones: meal.strInstructions || "",
  };
}
