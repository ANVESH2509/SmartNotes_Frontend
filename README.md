# StudyShelf frontend

StudyShelf is the React + Vite client for the Smart Notes Sharing Platform. The public landing page is available at `/`; the authenticated workspace is under `/app`.

## Routes

- `/` — public product landing page; it does not fetch or show note data
- `/login` and `/register` — public authentication pages
- `/app` — authenticated note library
- `/app/notes/:id` — authenticated note details and PDF download
- `/app/upload` — authenticated PDF upload

The backend independently requires a JWT for every `/api/notes` endpoint.

## Local development

Requirements: Node.js 20.19+ or 22.12+, npm, and the backend running at `http://localhost:8080`.

From this folder:

```sh
npm ci
npm run dev
```

Vite prints its local address, usually `http://localhost:5173`. To change the API address locally, copy `.env.example` to `.env` and update `VITE_API_BASE_URL`. Never put credentials or JWT signing keys in frontend environment variables.

## Production build

```sh
npm run build
npm run preview
```

For Vercel, set the project root to `frontend`, build command to `npm run build`, and output directory to `dist`. Set `VITE_API_BASE_URL` to the actual Render backend origin. `.env.production.example` is only a placeholder. The production client does not fall back to localhost. `vercel.json` rewrites client-side routes to the SPA entry point.

## API integration

The Axios client calls `/api/auth/register`, `/api/auth/login`, `/api/notes`, `/api/notes/{id}`, `/api/notes/{id}/download`, and multipart `POST /api/notes`. Registration uses the backend field names `fullName`, `email`, and `password`. The login JWT is kept in browser local storage and sent with authenticated workspace requests. An unauthorized protected API response clears the session and redirects to sign-in. PDF uploads use `FormData`; the browser sets the multipart content type and boundary.
