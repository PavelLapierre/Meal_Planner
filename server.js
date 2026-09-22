/*
  server.js — servidor estático mínimo para ejecutar el proyecto.
  Uso: node server.js  →  http://localhost:8080
  (Evita problemas de CORS/CORS file:// al usar Fetch en local)
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const PUERTO = process.env.PORT || 8080;
const RAIZ = __dirname;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

const servidor = http.createServer((peticion, respuesta) => {
  let ruta = decodeURIComponent(peticion.url.split("?")[0]);
  if (ruta === "/") ruta = "/index.html";

  const rutaCompleta = path.join(RAIZ, path.normalize(ruta));
  if (!rutaCompleta.startsWith(RAIZ)) {
    respuesta.writeHead(403);
    respuesta.end("403 Forbidden");
    return;
  }

  fs.readFile(rutaCompleta, (error, contenido) => {
    if (error) {
      respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      respuesta.end("404 Not Found");
      return;
    }
    const ext = path.extname(rutaCompleta).toLowerCase();
    respuesta.writeHead(200, { "Content-Type": TIPOS[ext] || "application/octet-stream" });
    respuesta.end(contenido);
  });
});

servidor.listen(PUERTO, () => {
  console.log(`Meal Planner corriendo en http://localhost:${PUERTO}`);
});
