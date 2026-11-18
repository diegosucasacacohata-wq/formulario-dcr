const TITULOS = ['Fecha y hora', 'Nombres', 'Apellidos']; // los títulos de las columnas, en este orden

function doPost(e) { // esto corre cada vez que alguien aprieta "Enviar" en la página
  const datos = (e && e.parameter) || {}; // agarra lo que mandó la página (o nada, si lo corres a mano)
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // agarra la primera pestaña del Sheet
  if (hoja.getLastRow() === 0) hoja.appendRow(TITULOS); // si la hoja está vacía, primero escribe los títulos
  const nombres = limpiar(datos.nombres); // saca los nombres que llegaron
  const apellidos = limpiar(datos.apellidos); // saca los apellidos que llegaron
  if (!nombres || !apellidos) return responder({ ok: false, error: 'Faltan nombres o apellidos' }); // si falta algo, no guarda y avisa
  hoja.appendRow([new Date(), nombres, apellidos]); // agrega una fila nueva: fecha y hora, nombres, apellidos
  return responder({ ok: true }); // le contesta a la página "todo bien"
} // termina doPost

function limpiar(texto) { // ordena lo que escribió la persona
  texto = String(texto || '').trim().slice(0, 80); // lo vuelve texto, quita espacios de los bordes y lo corta a 80 letras
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto; // si empieza con = + - @ le pone ' adelante para que el Sheet no lo tome como fórmula
} // termina limpiar

function responder(respuesta) { // arma la respuesta que le llega a la página
  return ContentService.createTextOutput(JSON.stringify(respuesta)) // convierte la respuesta a texto JSON
    .setMimeType(ContentService.MimeType.JSON); // y avisa que es JSON
} // termina responder
