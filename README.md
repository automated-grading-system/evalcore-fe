# EvalCore Frontend

Automated ASP.NET Project Evaluation Platform — frontend for the PRN232 grading system.

## Stack

| Tool | Version |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Runtime | Bun |
| UI | Tailwind CSS v4 + shadcn/ui (radix-nova) |
| Language | TypeScript 5 |
| Icons | lucide-react + existing inline shell icons |
| Server data | TanStack Query |
| HTTP client | Axios |

## Quick Start (Backend + Frontend)

To test the full auth, class, and lab flows, run the Dockerized backend stack alongside the frontend. The backend must include OPS-004 Class Service and Lab Service routes through the API Gateway.

### 1. Backend app stack

```bash
cd ../prn232-ops
docker compose --profile app up -d
make smoke-app
```

### 2. Frontend

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use real Gateway-backed APIs with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

The frontend must only call the Gateway on port 8080. It must not call Identity on 8081 or Class Service on 8082 directly.

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
| Student | [student@ags.local](mailto:student@ags.local) | Password123! |
| Lecturer | [lecturer@ags.local](mailto:lecturer@ags.local) | Password123! |
| Admin | [admin@ags.local](mailto:admin@ags.local) | Password123! |

## Class and lab flow

1. Lecturer creates a class from `/lecturer/classes/new`.
2. Student searches for the class from `/student/classes/search` and joins it.
3. Lecturer opens the class detail page and creates a lab.
4. Frontend posts lab metadata through the Gateway.
5. Frontend uploads the requirement PDF and Postman collection JSON directly to MinIO presigned URLs.
6. Frontend completes lab assets through the Gateway.
7. Student opens the joined class, sees active labs, and downloads only the requirement PDF.

Students do not see the Postman collection download. Lecturer lab detail pages can download both requirement and collection assets.

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
- `/student/labs/[labId]` — Lab requirement detail
- `/student/submissions` — Submission history
- `/student/submissions/[submissionId]` — Result detail

### Lecturer (`/lecturer/**`)
- `/lecturer` — Dashboard overview
- `/lecturer/classes` — Class management
- `/lecturer/classes/new` — Create class
- `/lecturer/classes/[classId]` — Class detail
- `/lecturer/classes/[classId]/labs/new` — Create lab and upload assets
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

All Gateway API calls use the Axios client at `src/lib/api/client.ts`.
Class and lab server data is accessed through TanStack Query hooks in `src/features/classes/hooks/use-classes.ts`.

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
