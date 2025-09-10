/**
 * Google Apps Script - versión simple
 * 
 * ⚠️ Nota:
 * Este código se pega en tu proyecto de Google Sheets (Extensiones → Apps Script).
 * No usar setHeader ni CORS aquí. El proxy en Netlify (/.netlify/functions/sheets)
 * se encarga de los encabezados y permisos.
 */

function doGet(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Hoja 1'); // ajusta el nombre si tu pestaña es distinta
  const data = sh.getDataRange().getDisplayValues();
  const head = data.shift();
  const rows = data.map(r => head.reduce((o, k, i) => (o[k] = r[i], o), {}));
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Hoja 1');
  const body = JSON.parse(e.postData.contents);

  const row = [
    body.fecha_inicio || '', body.hora_inicio || '',
    body.fecha_fin || '',   body.hora_fin || '',
    body.tecnico || '', body.tipo || '', body.garantia || '',
    body.cobrado || 'No', body.monto || 0,
    body.cliente || '', body.telefono || '',
    body.ciudad || '', body.notas || '',
    body.lat || '', body.lng || ''
  ];

  sh.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
