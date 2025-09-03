export default async (req, res) => {
  const target = process.env.SHEETS_TARGET; // URL /exec del Apps Script
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return; }
  if (!target) { res.statusCode = 500; res.end(JSON.stringify({ error: 'Falta SHEETS_TARGET' })); return; }
  try {
    if (req.method === 'GET') {
      const f = await fetch(target);
      const txt = await f.text();
      res.statusCode = 200;
      res.setHeader('Content-Type', f.headers.get('content-type') || 'application/json');
      res.end(txt); return;
    }
    if (req.method === 'POST') {
      const body = await new Promise(r => { let d=''; req.on('data', c=> d+=c); req.on('end', ()=> r(d||'{}')); });
      const f = await fetch(target, { method:'POST', headers:{'Content-Type':'application/json'}, body });
      const txt = await f.text();
      res.statusCode = f.status;
      res.setHeader('Content-Type', f.headers.get('content-type') || 'application/json');
      res.end(txt); return;
    }
    res.statusCode = 405; res.end('Method Not Allowed');
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error:'Upstream error', detail:String(e) }));
  }
}
