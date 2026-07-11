# ClientHub CRM

A full-stack CRM platform for freelancers and small agencies to manage clients, projects, and revenue.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind v4, daisyUI v5 |
| **Backend** | Express 5, TypeScript, MongoDB (native driver) |
| **Auth** | better-auth (email/password) |
| **HTTP** | Axios |

## Structure

```
clienthub/
├── frontend/          # Next.js 16 app
│   ├── app/           # Pages & API routes
│   ├── components/    # React components
│   └── services/      # API client functions
├── backend/           # Express 5 API server
│   └── src/
│       ├── server.ts  # Entry point (routes + DB)
│       └── types/     # Shared TypeScript types
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env    # Configure your MongoDB URI & JWT secret
npm run dev             # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # Set backend URL & auth secrets
npm run dev             # Starts on http://localhost:3000
```

## Features

- **Dashboard** — Overview of clients, projects, revenue, and deadlines
- **Client Management** — Add, view, and manage clients
- **Project Tracking** — Organize projects per client
- **Revenue & Invoices** — Track earnings and pending payments
- **Authentication** — Secure login/register with better-auth
- **Responsive** — Works on desktop and mobile
