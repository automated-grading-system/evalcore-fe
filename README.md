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

## Quick Start (Backend + Frontend)

To test the full authentication flow, you must run the Dockerized backend stack alongside the frontend.

### 1. Backend auth stack

```bash
cd ../prn232-ops
docker compose --profile app up -d
make smoke-app
```

### 2. Frontend real auth

```bash
# Install dependencies
bun install

# Ensure environment is set to real auth
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8080
# NEXT_PUBLIC_USE_MOCK_AUTH=false

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
All requests must go through the API Gateway (port 8080).

## Auth modes

### Real Identity Service (Default)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

This is the production default. All requests go through Caddy/API Gateway at port 8080. 
The gateway forwards `/api/auth/*` and `/api/users/*` to the Identity Service.

### Mock auth (no backend required)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

## Demo accounts

The following demo accounts exist. They will autofill in the login page UI:

| Role | Email | Password |
|---|---|---|
| Student | student@ags.local | Password123! |
| Lecturer | lecturer@ags.local | Password123! |
| Admin | admin@ags.local | Password123! |

## Troubleshooting

### Gateway down
**Symptom:** `fetch failed` or `API Gateway unavailable` error on login.
**Fix:** Ensure the backend stack is running (`docker compose --profile app up -d`). Verify Gateway health at `http://localhost:8080/health`.

### Identity login fails
**Symptom:** `INVALID_CREDENTIALS` or 401 on login.
**Fix:** Ensure the database is seeded. Try restarting the identity container or running migrations. Verify the demo accounts match the backend seed data.

### Token expired/invalid
**Symptom:** Immediate redirect to login after accessing dashboard.
**Fix:** The JWT token expired. Log in again. We do not implement refresh tokens for this school project.

### CORS issue
**Symptom:** Browser console shows CORS errors when calling the API.
**Fix:** Ensure you are calling the Gateway (`localhost:8080`) and NOT the Identity Service directly (`localhost:8081`). The Gateway handles CORS headers.

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
