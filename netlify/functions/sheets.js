export default async (request, context) => {
  const target = process.env.SHEETS_TARGET;

  // CORS headers
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: cors });
  }

  if (!target) {
    return new Response(JSON.stringify({ error: "Falta SHEETS_TARGET" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    if (request.method === "GET") {
      const upstream = await fetch(target, { method: "GET" });
      const body = await upstream.text();
      return new Response(body, {
        status: 200,
        headers: { ...cors, "Content-Type": upstream.headers.get("content-type") || "application/json" },
      });
    }

    if (request.method === "POST") {
      const body = await request.text(); // JSON del frontend
      const upstream = await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const txt = await upstream.text();
      return new Response(txt, {
        status: upstream.status,
        headers: { ...cors, "Content-Type": upstream.headers.get("content-type") || "application/json" },
      });
    }

    return new Response("Method Not Allowed", { status: 405, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Upstream error", detail: String(e) }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
};
