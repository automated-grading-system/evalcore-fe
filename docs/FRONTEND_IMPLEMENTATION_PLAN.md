# Frontend Implementation Plan

## 1. Principle

* **Keep existing Next.js + Bun stack**: Do not change the package manager, bundler, or routing paradigm.
* **Do not rewrite project**: Build iteratively on top of the established folder tree.
* **Build frontend against API contract**: Write types and interfaces that strictly match backend expectations.
* **All API calls go through NEXT_PUBLIC_API_URL**: Do not hardcode internal backend services or microservice port numbers. Use API Gateway (`http://localhost:8080`).
* **Use response envelope**: All incoming responses must be mapped through a common type envelope parser.
* **Use mock mode only inside API/auth layer**: Maintain visual components completely clean of mocking logic. Control behavior dynamically via environment configuration.

## 2. FE-001 Scope

FE-001 will implement the authentication foundations, dashboards, and role redirection:
* Shared API client (`src/lib/api/client.ts`) supporting requests, base headers, and token injections.
* Generic types: `ApiResponse<T>` and `PagedResponse<T>`.
* Auth API module (`src/lib/api/auth.ts`).
* Auth state store with support for token persistence (`localStorage`).
* `/login` page (supporting user role demo credentials autofill).
* `/register` page.
* Role-based dashboard redirect module.
* Shell layout structures for Student, Lecturer, and Admin.
* Client-side/middleware route guard based on role definitions.
* Offline mock auth toggle configuration via `NEXT_PUBLIC_USE_MOCK_AUTH`.

## 3. Proposed Folder Structure

Adapted specifically to Next.js App Router and the existing structure:

```
src/
├── app/
│   ├── (auth)/                  # Shared login/register layout and pages
│   │   ├── login/
│   │   │   └── page.tsx         # Login page with demo autofill triggers
│   │   └── register/
│   │       └── page.tsx         # Registration page
│   ├── student/                 # Student area routes
│   │   ├── layout.tsx           # Student dashboard sidebar & navigation header
│   │   └── page.tsx             # Student dashboard homepage
│   ├── lecturer/                # Lecturer area routes
│   │   ├── layout.tsx           # Lecturer dashboard layout
│   │   └── page.tsx             # Lecturer dashboard homepage
│   ├── admin/                   # Admin area routes
│   │   ├── layout.tsx           # Admin dashboard layout
│   │   └── page.tsx             # Admin dashboard homepage
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Global root layout
│   └── page.tsx                 # Root landing page (redirects to dashboards or /login)
├── components/
│   ├── layout/                  # Main layout frames, navigation elements
│   ├── auth/                    # LoginForm, RegisterForm, and role triggers
│   └── ui/                      # shadcn button, input, select primitives
├── hooks/                       # Custom hooks (e.g., useAuth)
└── lib/
    ├── api/                     # API client modules
    │   ├── client.ts            # Base fetch config & response handlers
    │   └── auth.ts              # API calls targeting auth endpoints
    ├── stores/                  # Auth state management
    │   └── auth-store.ts        # Stores current token, user details, and active role
    ├── types/                   # Shared TypeScript declarations
    │   ├── api.d.ts             # API structure contracts
    │   └── auth.d.ts            # Authentication structures
    └── utils.ts                 # Layout utility classes
```

## 4. API Modules To Create Later

These modules will be developed iteratively as corresponding backend services are finalized:
* **authApi**: User login, registration, password resets, and session query.
* **classApi**: Searching, listing, joining, creating, and updating classes.
* **labApi**: Creating, reading, updating, and listing lab assignments.
* **submissionApi**: Compiling, packaging, uploading, and listing ZIP archives of student code.
* **evaluationApi**: Reviewing evaluation summaries, status details, and detailed project test metrics.
* **notificationApi**: Real-time server-sent events or notifications about grading updates.
* **adminApi**: User moderation, server log inspections, and system health monitors.

## 5. Route Plan

### Public Routes
* `/login` - Credential entry and demo account shortcuts.
* `/register` - Student or lecturer registration form.

### Student Role (Prefix: `/student`)
* `/student` - Welcome page, overview metrics, active classes.
* `/student/classes` - List of joined classes.
* `/student/classes/search` - Look up and apply to join new classes.
* `/student/classes/[classId]` - Class detail overview (lecturers, labs).
* `/student/labs/[labId]` - View lab description and instructions.
* `/student/submissions` - History of student code deliveries.
* `/student/submissions/[submissionId]` - Evaluation reports and score breakdown.

### Lecturer Role (Prefix: `/lecturer`)
* `/lecturer` - Class list summary, action items, grading queues.
* `/lecturer/classes` - Class creation wizard and management list.
* `/lecturer/classes/[classId]` - Student lists, add/remove members, lab management.
* `/lecturer/labs/[labId]` - Lab instructions, update configuration.
* `/lecturer/labs/[labId]/submissions` - Queue of student submissions.
* `/lecturer/labs/[labId]/results` - Consolidated grades spreadsheet and export triggers.

### Admin Role (Prefix: `/admin`)
* `/admin` - Server metrics, overview of grading queues, system summary.
* `/admin/users` - Lock/unlock accounts, alter roles.
* `/admin/health` - Monitor backend CPU/Memory & microservice uptime.
* `/admin/logs` - Audit trail and grading exceptions viewer.

## 6. UI Direction

We align visual implementation with **Taste Skill** guidelines:
* **Professional Spacing**: Set strict layout margins (e.g., standard layout paddings, consistent dashboard gap spacing).
* **Clear Spacing Rhythm**: Use a strict vertical and horizontal spacing system. Avoid crowded borders or dynamic paddings.
* **Strong Visual Hierarchy**: Distinguish headers, secondary labels, and status badges clearly.
* **Premium Dashboard Cards**: Rely on clean borders, light background fills, and minimal shadows instead of intense gradients.
* **Functional Tables**: Clean headers, legible data alignment, clear state rows (empty/loading/error).
* **Restrained Motion**: Subtle micro-interactive transitions (hover opacity/slight scale) with no heavy decorative entry animations.
* **Professional States**: Design states for empty data, loader screens, and descriptive error messages.

## 7. Acceptance Criteria For FE-001

* **Request & Envelope Handling**: Fetch requests return wrapped values properly. Bad responses throw typed exceptions.
* **Auth Store Lifecycle**: Tokens are parsed, written to/read from persistent storage, and can clear successfully on logout.
* **Demo Shortcuts**: Single-click autofill buttons for Student, Lecturer, and Admin are available on `/login` to ease local testing.
* **Route Guarding**: Attempts to visit dashboard directories without authenticated credentials redirect user to `/login`. Visiting role pages without matching authority returns a custom forbidden banner or redirects to the user's correct home layout.
* **Compilation & Code Cleanliness**: Executing `bun run check-types` and `bun run lint` returns 0 errors.
