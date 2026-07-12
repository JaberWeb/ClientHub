# ClientHub CRM

A full-stack client management, project tracking, and invoicing platform for freelancers and small businesses. Built with Next.js 16 + Express 5 + MongoDB.

---

## Features

### 👥 Client Management
- Add, search, and manage client records
- Store contact info, addresses, industry, and notes

### 📁 Project Tracking
- Create projects linked to clients
- Track status: ongoing, pending, completed, cancelled
- Set project value, due dates, and descriptions

### 📄 Invoicing
- Generate invoices with auto-numbering (`INV-001`)
- Link invoices to clients and projects
- Mark as paid, overdue, or cancelled
- Print-ready PDF output (clean, no browser chrome)
- Company branding on invoices (logo + name from settings)

### 💰 Revenue Dashboard
- **Upcoming Revenue** — total value of ongoing projects
- **Received Revenue** — total amount from paid invoices
- Paginated table of paid invoices

### 📊 Dashboard Overview
- Real-time stats: revenue, client count, project count, overdue deadlines
- Recent activity feed (latest invoices)

### ⚙️ Company Settings
- Set company/legal name, address, and logo
- Logo upload via imgbb API
- Settings appear automatically on invoice headers

### 🔒 Authentication & Security
- Better Auth with email/password
- MongoDB session storage
- Bearer token authorization on all API routes
- Session validation + expiry checking
- Custom 404 and 403 error pages

### 📬 Contact Page
- Contact form sends email via SMTP (nodemailer)
- WhatsApp chat button
- Stored in MongoDB

---

## Tech Stack

### Frontend — `clienthub/frontend/`
| Technology | Purpose |
|------------|---------|
| **Next.js 16.2** | React framework (App Router) |
| **React 19.2** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **daisyUI v5** | Tailwind component plugin |
| **Better Auth** | Authentication (email/password, sessions) |
| **React Hook Form** | Form state management |
| **Axios** | HTTP client with JWT interceptor |
| **Lucide React** | Icon library |
| **MongoDB Driver** | Database access (no Mongoose) |

### Backend — `clienthub/backend/`
| Technology | Purpose |
|------------|---------|
| **Express 5** | HTTP server |
| **TypeScript** | Type safety |
| **MongoDB Driver** | Database access (native, no ORM) |
| **Nodemailer** | Email sending (contact form) |
| **JSON Web Token** | Legacy auth support |
| **bcrypt** | Password hashing |
| **CORS** | Cross-origin requests |

---

## Project Structure

```
clienthub/
├── frontend/                # Next.js application
│   ├── app/
│   │   ├── api/auth/        # Better Auth API routes + token endpoint
│   │   ├── auth/            # Sign in / Sign up pages
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── dashboard/       # Dashboard (protected)
│   │   │   ├── clients/     # Client CRUD
│   │   │   ├── projects/    # Project CRUD
│   │   │   ├── invoices/    # Invoice CRUD + detail/print
│   │   │   ├── revenue/     # Revenue analytics
│   │   │   ├── pending-invoices/ # Overdue invoices
│   │   │   └── settings/    # Company settings
│   │   ├── forbidden/       # 403 page
│   │   ├── not-found.tsx    # 404 page
│   │   └── layout.tsx       # Root layout with Navbar + Footer
│   ├── components/          # Shared UI components
│   ├── services/            # Axios API service layer
│   └── lib/                 # Better Auth config
│
├── backend/                 # Express API server
│   └── src/
│       ├── server.ts        # All routes, middleware, DB connection
│       └── types/           # TypeScript interfaces
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB instance (local or Atlas)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd clienthub

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Variables

**Frontend** — `frontend/.env`

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=clientHub
NEXT_PUBLIC_BACKEND_URI=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
```

**Backend** — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/clientHub?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=clientHub
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000

# SMTP for contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### 3. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev    # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev    # Starts on http://localhost:3000
```

Open `http://localhost:3000` → Sign up → Start managing clients and projects.

---

## Scripts

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (`:3000`) |
| `npm run build` | Production build + TypeScript check |
| `npm run lint` | ESLint |

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (`:5000`) |
| `npm run build` | TypeScript compilation to `dist/` |
| `npm start` | Run compiled production server |

---

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/contact` | Send contact form email |

### Protected (requires Bearer token)
| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/api/clients` | List / Create clients |
| `GET` | `/api/clients/:id` | Get single client |
| `GET/POST` | `/api/projects` | List / Create projects |
| `GET` | `/api/projects/:id` | Get single project |
| `PATCH` | `/api/projects/:id/status` | Update project status |
| `GET/POST` | `/api/invoices` | List / Create invoices |
| `GET` | `/api/invoices/:id` | Get single invoice (with project + client) |
| `PATCH` | `/api/invoices/:id/status` | Update invoice status (auto-completes project) |
| `GET/POST` | `/api/settings` | Get / Upsert company settings |

---

## Security

- **Session-based auth** via Better Auth — tokens stored in MongoDB `session` collection
- **Bearer token middleware** on all `/api/*` routes — validates against DB, checks expiry
- **Auto-complete** — marking invoice as paid marks linked project as completed
- **.env** files excluded from git — secrets stay local
- Passwords hashed with bcrypt

---

## Deployment

### Frontend — Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend — Railway / Render / Fly.io
1. Set `NODE_ENV=production` and all env vars on the host
2. Build command: `npm run build`
3. Start command: `npm start`
4. Update `NEXT_PUBLIC_BACKEND_URI` in frontend to point to the live backend URL

---

## NPM Packages

### Frontend
`next` `react` `react-dom` `better-auth` `@better-auth/mongo-adapter` `axios` `react-hook-form` `lucide-react` `recharts` `mongodb` `tailwindcss` `daisyui` `typescript` `eslint`

### Backend
`express` `cors` `dotenv` `nodemailer` `mongodb` `jsonwebtoken` `bcrypt` `tsx` `typescript`

---

## License

MIT
