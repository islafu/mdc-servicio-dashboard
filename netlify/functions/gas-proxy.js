const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  const GAS_URL = process.env.GAS_URL;
  if (!GAS_URL) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Missing GAS_URL env var" }) };
  }
  try {
    let url = GAS_URL;
    if (event.httpMethod === "GET" && event.rawQuery) {
      url += (GAS_URL.includes("?") ? "&" : "?") + event.rawQuery;
    }
    const init = { method: event.httpMethod };
    if (event.httpMethod === "POST") {
      init.headers = { "Content-Type": "application/json" };
      init.body = event.body || "{}";
    }
    const resp = await fetch(url, init);
    const text = await resp.text();
    const contentType = resp.headers.get("content-type") || "application/json";
    return { statusCode: resp.status, headers: { ...CORS, "Content-Type": contentType }, body: text };
  } catch (err) {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "Proxy error", detail: String(err) }) };
  }
};
