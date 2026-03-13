# QUICKSHOW

A full-stack movie ticket booking application with:

- `client/`: React + Vite frontend
- `server/`: Node.js + Express + MongoDB backend
- Clerk authentication
- Stripe checkout and webhook payment confirmation
- TMDB movie metadata integration
- Inngest background jobs/events (booking checks, notifications)

## Monorepo Structure

```text
QUICKSHOW/
  client/   # React app (Vite)
  server/   # Express API
```

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Clerk
- Backend: Express, Mongoose, Clerk Express, Stripe, Inngest, Nodemailer
- Database: MongoDB
- External APIs/Services: TMDB, Stripe, Clerk, Brevo SMTP

## Prerequisites

Install and prepare the following before setup:

- Node.js `18+` (recommended `20+`)
- npm `9+`
- MongoDB Atlas (or local MongoDB)
- Clerk account (auth)
- Stripe account (checkout + webhook)
- TMDB API token (v4 Bearer token)
- Brevo SMTP credentials (for transactional email)

## 1. Clone And Install

From the project root:

```bash
# client deps
cd client
npm install

# server deps
cd ../server
npm install
```

## 2. Environment Variables

Create these files:

- `client/.env`
- `server/.env`

### `client/.env`

```env
VITE_BASE_URL=http://localhost:3000
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
VITE_CURRENCY=$
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
```

### `server/.env`

```env
# Server
PORT=3000

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx

# Inngest
INNGEST_EVENT_KEY=<inngest_event_key>
INNGEST_SIGNING_KEY=<inngest_signing_key>

# TMDB (Bearer token, usually starts with eyJ...)
TMDB_API_KEY=<tmdb_v4_bearer_token>

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx

# SMTP (Brevo)
SMTP_USER=<brevo_smtp_login>
SMTP_PASS=<brevo_smtp_password>
SENDER_EMAIL=no-reply@yourdomain.com
```

## 3. Run The App Locally

Open two terminals from repo root.

Terminal 1 (backend):

```bash
cd server
npm run server
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Health check:

```bash
curl http://localhost:3000/
```

Expected response: `Server is Live!`

## 4. Clerk Setup Notes

1. Create a Clerk application.
2. Add `VITE_CLERK_PUBLISHABLE_KEY` to `client/.env`.
3. Add `CLERK_SECRET_KEY` to `server/.env`.
4. In Clerk Dashboard, add allowed origins/redirects for local development (for example `http://localhost:5173`).

### Admin Access

Admin routes require `privateMetadata.role === "admin"` in Clerk.

Set this in Clerk Dashboard for your user:

```json
{
  "role": "admin"
}
```

## 5. Stripe Webhook Setup (Local)

The backend expects webhook requests at:

- `POST /api/stripe`

Use Stripe CLI to forward webhooks to local server:

```bash
stripe listen --forward-to localhost:3000/api/stripe
```

Copy the generated signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` in `server/.env`.

## 6. TMDB Setup

Get a TMDB API Read Access Token (v4) and set it as `TMDB_API_KEY` in `server/.env`.

The app uses this token to:

- fetch now-playing movies
- fetch movie details and credits when creating shows

## 7. Inngest Notes

The app exposes Inngest handlers at:

- `GET/POST /api/inngest`

Current jobs/events include:

- sync Clerk users into MongoDB
- release unpaid bookings after timeout
- send booking confirmation email
- send periodic reminders
- notify users about newly added shows

For local development, these functions are available when the server is running.

## 8. Production Build Commands

Frontend:

```bash
cd client
npm run build
npm run preview
```

Backend:

```bash
cd server
npm start
```

## 9. Deploying (Vercel)

Both `client/` and `server/` include `vercel.json`. Typical approach:

- Deploy `client` as one Vercel project.
- Deploy `server` as another Vercel project.
- Set environment variables in each project dashboard.
- Update `VITE_BASE_URL` in the client project to the deployed server URL.

## 10. API Overview

### Public

- `GET /` - health check
- `GET /api/show/all` - list available movies/shows
- `GET /api/show/:movieId` - show timings by movie
- `GET /api/bookings/seats/:showId` - occupied seats

### Authenticated (Clerk token required)

- `GET /api/user/bookings`
- `POST /api/user/update-favorite`
- `GET /api/user/favorites`
- `POST /api/bookings/create`

### Admin (`privateMetadata.role = admin`)

- `GET /api/admin/is-admin`
- `GET /api/admin/dashboard`
- `GET /api/admin/all-shows`
- `GET /api/admin/all-bookings`
- `GET /api/show/now-playing`
- `POST /api/show/add`

## 11. Troubleshooting

### Frontend says Clerk key is missing

Set `VITE_CLERK_PUBLISHABLE_KEY` in `client/.env` and restart dev server.

### Requests fail from frontend to backend

Check `VITE_BASE_URL` in `client/.env` points to your backend (`http://localhost:3000` locally).

### Mongo connection errors

Verify `MONGODB_URI` and that the database/network access rules allow your IP.

### Stripe webhook signature errors

Make sure `STRIPE_WEBHOOK_SECRET` matches the active Stripe CLI forwarding session.

### Admin pages redirect to home

Ensure your Clerk user has `privateMetadata.role` set to `admin`.

## 12. Useful Scripts

Client (`client/package.json`):

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

Server (`server/package.json`):

- `npm run server` (nodemon)
- `npm start`
