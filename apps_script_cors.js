function cors_(out) {
  return out
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doOptions(e) {
  return cors_( ContentService.createTextOutput('') )
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Hoja 1');
  const data = sh.getDataRange().getDisplayValues();
  const head = data.shift();
  const rows = data.map(r => head.reduce((o, k, i) => (o[k] = r[i], o), {}));
  return cors_( ContentService.createTextOutput(JSON.stringify(rows)) )
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

  return cors_( ContentService.createTextOutput(JSON.stringify({ ok: true })) )
    .setMimeType(ContentService.MimeType.JSON);
}
