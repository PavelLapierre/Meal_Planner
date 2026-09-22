4. Ejercicio integrador 4 — Meal Planner: Planificador semanal de comidas
4.1 Nombre de la aplicación
Meal Planner — Planificador semanal de comidas

4.2 Problema que resuelve
Los estudiantes pueden utilizar una aplicación sencilla para buscar recetas y organizar una planificación semanal de comidas.

4.3 Objetivo de aprendizaje
Aplicar de forma integrada DOM, eventos, funciones JavaScript, callbacks, Promesas y Fetch, construyendo una aplicación interactiva basada en datos externos.

4.4 Funcionalidades principales
Buscar recetas por ingrediente.
Mostrar nombre, categoría e imagen.
Visualizar información básica de una receta.
Agregar una receta a un día de la semana.
Eliminar una receta del plan.
Mostrar el menú semanal.
Gestionar estados de carga, resultados y errores.
4.5 Datos que debe gestionar
Ingrediente, Nombre de receta, Categoría, Área/origen, Imagen, Identificador, Día de la semana, Receta seleccionada y Plan semanal.

4.6 API pública sugerida
TheMealDB, mediante sus endpoints públicos.

4.7 Requisitos funcionales
RF01. Permitir introducir un ingrediente.
RF02. Consultar recetas mediante Fetch.
RF03. Mostrar las recetas encontradas.
RF04. Permitir seleccionar una receta.
RF05. Permitir asignar una receta a un día de la semana.
RF06. Mostrar el menú semanal.
RF07. Permitir eliminar recetas del menú.

4.8 Requisitos técnicos
Tecnología	Aplicación
HTML5->Formulario, resultados y planificación
CSS3->Tarjetas, calendario semanal y estados
JavaScript->Lógica de búsqueda y planificación
DOM->Creación y modificación de recetas
Callbacks->Eventos de búsqueda, botones y selección
Promesas->Control de operaciones asíncronas
Fetch->Consulta de recetas
Estados UI->Cargando, resultados, vacío y error
Manejo de errores->Problemas de API o consultas sin resultados

4.9 Flujo general
Usuario introduce ingrediente
        ↓
Fetch
        ↓
Promesa
        ↓
Resultados
        ↓
Selección de receta
        ↓
Selección de día
        ↓
Actualización del DOM
        ↓
Menú semanal

4.10 Estructura de archivos
meal-planner/
│
├── index.html
├── css/
│   └── estilos.css
└── js/
    ├── app.js
    ├── api.js
    └── planner.js

4.11 Evidencias
Búsqueda por ingrediente.
Visualización de resultados.
Selección de una receta.
Asignación a un día.
Visualización del menú semanal.
Eliminación de una receta.
Consulta sin resultados.
Manejo de errores.
Identificación de Fetch.
Identificación de Promesas.
Identificación de callbacks.
Explicación de la actualización del DOM.

4.12 Preguntas técnicas
¿Qué información devuelve la API?
¿Cómo se convierte la respuesta en datos utilizables?
¿Cómo se genera una tarjeta de receta?
¿Cómo se agrega una receta al día seleccionado?
¿Cómo se elimina?
¿Dónde está el callback de un evento?
¿Dónde se utiliza una Promesa?
¿Qué sucede si Fetch falla?
¿Cómo impedirías dos recetas en el mismo día?

5. Rúbrica de evaluación
La rúbrica está diseñada para comprobar tanto el funcionamiento de la aplicación como la comprensión individual del código.

Criterio	Sobresaliente (3)	Suficiente (2)	En desarrollo (1)	Insatisfactorio (0)	y % de Peso

1. Funcionamiento y demostración de la aplicación (Peso 25%): 	
(3)La aplicación funciona correctamente; demuestra todas las funcionalidades principales, responde adecuadamente a las acciones y no presenta errores relevantes.	
(2)Funciona correctamente en la mayoría de funcionalidades; presenta errores menores que no impiden la demostración.	
(1)Varias funcionalidades presentan problemas o requieren intervención del equipo.	
(0)La aplicación no funciona o no permite demostrar las funcionalidades principales.	

2. Conocimiento de HTML y CSS (Peso 15%):	
(3)Explica claramente la estructura HTML, semántica, organización de elementos y decisiones CSS; puede realizar modificaciones sencillas.	
(2)Explica adecuadamente la mayor parte de HTML y CSS utilizado.	
(1)Reconoce algunos elementos, pero presenta dificultades para explicar su organización o estilos.	
(0)No puede explicar la estructura HTML ni los estilos principales utilizados.	

3. Conocimiento de JavaScript (Peso 15%):	
(3)Explica variables, funciones, estructuras de control, eventos y lógica; puede modificar una función sencilla.	
(2)Comprende la mayor parte de la lógica JavaScript.	
(1)Comprende parcialmente el código, pero depende de explicaciones del equipo.	
(0)No puede explicar la lógica JavaScript utilizada.	

4. Manipulación del DOM (Peso 15%):	
(3)Explica cómo se seleccionan, crean, modifican y eliminan elementos; puede realizar una modificación durante la sustentación.	
(2)Comprende las principales operaciones DOM utilizadas.	
(1)Identifica algunas operaciones, pero no explica claramente su funcionamiento.	
(0)No puede explicar cómo se actualiza la interfaz mediante el DOM.	

5. JavaScript asincrónico (Peso 15%):	
(3)Explica correctamente callbacks, Promesas y Fetch; identifica dónde y por qué se utilizan y explica el manejo de errores.	
(2)Comprende Fetch, Promesas y callbacks, aunque presenta algunas imprecisiones.	
(1)Reconoce los conceptos, pero tiene dificultades para explicar el flujo asíncrono.	
(0)No puede explicar Fetch, Promesas ni callbacks utilizados.	

6. Comprensión global del código:	
(3)Explica las principales partes de la aplicación, justifica decisiones técnicas y realiza modificaciones sencillas sin depender del resto del equipo.	
(2)Explica adecuadamente la arquitectura general y algunas decisiones técnicas.	
(1)Comprende parcialmente la estructura, pero depende considerablemente de otros integrantes.	
(0)No puede explicar las principales partes del código ni justificar su funcionamiento.	