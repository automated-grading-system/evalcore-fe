# EvalCore Frontend

Automated ASP.NET Project Evaluation Platform — frontend for the PRN232 grading system.

## Stack

| Tool | Version |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Runtime | Bun |
| UI | Tailwind CSS v4 + shadcn/ui (radix-nova) |
| Language | TypeScript 5 |
| Icons | Inline SVG (lucide-compatible paths) |

## Quick start

```bash
# Install dependencies
bun install

# Copy local environment
cp .env.example .env.local

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | API Gateway base URL |
| `NEXT_PUBLIC_USE_MOCK_AUTH` | `false` | Enable local mock auth |

Copy `.env.example` to `.env.local` and adjust.

**Never point `NEXT_PUBLIC_API_URL` at internal microservice ports directly.**
All requests must go through the API Gateway.

## Auth modes

### Mock auth (no backend required)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

Three demo accounts are available on the Login page when mock mode is enabled:

| Role | Email | Password |
|---|---|---|
| Student | student@ags.local | Password123! |
| Lecturer | lecturer@ags.local | Password123! |
| Admin | admin@ags.local | Password123! |

Clicking a demo button fills email and password only. Submit the form to log in.

### Real Identity Service (through API Gateway)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

This is the production default. All requests go through Caddy/API Gateway at port 8080.

### Real Identity Service before Gateway is ready

If you want to test directly against the Identity Service before Caddy is configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:<identity-service-port>
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

Document that this is a temporary config and revert to the Gateway URL for all other environments.

## Route map

### Public
- `/` — Landing page
- `/login` — Sign in
- `/register` — Create account

### Student (`/student/**`)
- `/student` — Dashboard overview
- `/student/classes` — Joined classes
- `/student/classes/search` — Find and join classes
- `/student/classes/[classId]` — Class detail
- `/student/labs/[labId]` — Lab detail and submission
- `/student/submissions` — Submission history
- `/student/submissions/[submissionId]` — Result detail

### Lecturer (`/lecturer/**`)
- `/lecturer` — Dashboard overview
- `/lecturer/classes` — Class management
- `/lecturer/classes/[classId]` — Class detail
- `/lecturer/labs` — Lab management
- `/lecturer/labs/[labId]` — Lab configuration
- `/lecturer/labs/[labId]/submissions` — Submission queue
- `/lecturer/labs/[labId]/results` — Graded results
- `/lecturer/results` — Overall results

### Admin (`/admin/**`)
- `/admin` — Dashboard overview
- `/admin/users` — User management
- `/admin/health` — Service health
- `/admin/logs` — System logs

## Scripts

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run lint         # ESLint
bun run check-types  # TypeScript check
bun run format       # Prettier
```

## API contract

All API calls use the central client at `src/lib/api/client.ts`.

Response envelope:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
}
```

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login and register routes
│   ├── student/          # Student area
│   ├── lecturer/         # Lecturer area
│   └── admin/            # Admin area
├── components/
│   ├── auth/             # ProtectedLayout
│   ├── layout/           # DashboardShell, Sidebar, Topbar
│   └── ui/               # Button, Input, Card, Badge, Alert, Skeleton
└── lib/
    ├── api/              # client.ts, auth-api.ts
    ├── auth/             # auth-context.tsx, auth-storage.ts, role-utils.ts
    └── types/            # api.ts
```
