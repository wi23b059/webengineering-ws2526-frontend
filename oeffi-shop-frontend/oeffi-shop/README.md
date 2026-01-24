# oeffi-shop — Kurzdokumentation

## Kurzbeschreibung
Eine kleine Vue 3 + Vite Shopping-Frontend-Applikation für Wiener Öffi-Tickets.  
Backend-API wird unter `http://localhost:8081/api` erwartet.

## Technologie-Stack
- Vue 3 (Composition API, `<script setup>`)
- Vite
- TypeScript
- Axios für API-Calls
- Tailwind CSS

## Wichtige Befehle
- **Installation:** `npm install`
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Projektstruktur (Auszug)
- `public/docs` — statische, vom Dev-Server servierte Bilder (öffentlicher Root: `/docs/...`)
- `src/docs` — Bilder/Assets, die im Bundle landen können
- `src/components/atoms/ProductCard.vue` — Produktkarte mit Bildloader
- `src/views/HomeView.vue` — Anzeige der Produkte auf der Startseite
- `src/services/api.ts` — API-Konfiguration / helper
- `src/stores/*` — Pinia Stores (Produkte, Warenkorb, User, ...)
