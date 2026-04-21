# Travelex Frontend

Frontend sviluppato con **Next.js + TypeScript** per la piattaforma Travelex.

## Descrizione

Travelex è una piattaforma di condivisione di esperienze di viaggio. Il frontend permette agli utenti di:

- Registrarsi e fare login
- Visualizzare e filtrare post di viaggio
- Creare, modificare ed eliminare i propri post
- Commentare i post della community
- Mettere e togliere like
- Navigare il proprio profilo

---

## Tecnologie

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- React Query (server state e optimistic updates)
- Zustand (client state: autenticazione e filtri)
- Zod + React Hook Form (validazione form)

---

## Installazione

Clona il progetto:

```bash
git clone https://github.com/nazariodicataldo/travelex_frontend
cd travelex-frontend
```

Installa le dipendenze:

```bash
pnpm install
```

---

## Configurazione

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

> Il backend Laravel deve essere in esecuzione prima di avviare il frontend. Assicurati che le CORS siano configurate per accettare richieste da `http://localhost:3000`.

---

## Avvio

```bash
pnpm run dev
```

Il frontend sarà disponibile su: `http://localhost:3000`
