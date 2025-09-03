# MDC — Dashboard de Servicio Técnico (Reporte mensual)

Mini-plataforma para capturar y presentar actividades del equipo de servicio técnico (Israel, Selene, Diego, Yared).

## Características
- Captura web (celular/PC)
- KPIs + gráficas (Chart.js)
- Mapa de cobertura (Google Maps + Places)
- Filtros por técnico, tipo, garantía y búsqueda
- Exportación a PDF y CSV
- Datos en Google Sheets vía Apps Script

## Requisitos
- Una API Key de Google Maps (Maps JavaScript API + Geocoding API + Places API). **$200 USD de crédito gratis/mes**.
- Un Google Sheet con columnas: `fecha, tecnico, tipo, garantia, cliente, ciudad, notas, lat, lng` y un Web App de Apps Script (GET/POST).

## Instalación local
1. Clona este repo o descarga el ZIP.
2. Edita `public/index.html` y reemplaza **REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY** por tu key real (en **2 lugares**).
3. (Opcional) Configura `SHEETS_ENDPOINT` con tu Web App de Apps Script para persistir datos.

## Deploy rápido a Netlify
- Opción A: **Drag & Drop**: Arrastra la carpeta `public/` al cuadro de Deploys en Netlify.
- Opción B: **Conectar GitHub**: crea el repo y conéctalo a Netlify (publish dir = `public`).

### netlify.toml
Este repo incluye `netlify.toml` con headers de seguridad y soporte SPA.

## GitHub Pages (alternativa)
- En GitHub → Settings → Pages → Branch `main`, folder `/public`.

## Seguridad de la API Key
- Restringe tu key a **HTTP referrers** de tu sitio (Netlify o dominio propio).
- Restringe a **Maps JavaScript API**, **Geocoding API** y **Places API**.
- Si se filtra, **rota** la key.
