export default async (request, context) => {
  // CORS base
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  };

  const target = process.env.SHEETS_TARGET;

  // Preflight
  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: cors });
  }

  if (!target) {
    return json({ error: "Falta SHEETS_TARGET" }, 500, cors);
  }
  if (!/\/exec(\?|$)/.test(target)) {
    // No es obligatorio, pero ayuda a evitar errores típicos
    return json({ error: "SHEETS_TARGET debe apuntar al Web App y terminar en /exec" }, 500, cors);
  }

  try {
    // Construye URL con querystring si aplica
    const url = new URL(target);
    const reqUrl = new URL(request.url);
    // Copia query params del cliente -> upstream
    reqUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

    if (request.method === "GET") {
      const upstream = await fetch(url.toString(), { method: "GET" });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: {
          ...cors,
          "Content-Type": upstream.headers.get("content-type") || "application/json",
        },
      });
    }

    if (request.method === "POST") {
      // Pasamos el body tal cual (Apps Script espera JSON)
      const raw = await request.text();
      const upstream = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw || "{}",
      });
      const txt = await upstream.text();
      return new Response(txt, {
        status: upstream.status,
        headers: {
          ...cors,
          "Content-Type": upstream.headers.get("content-type") || "application/json",
        },
      });
    }

    return new Response("Method Not Allowed", { status: 405, headers: cors });
  } catch (e) {
    return json({ error: "Upstream error", detail: String(e) }, 502, cors);
  }
};

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
