# Frontend Agent Notes

## Do

* **Preserve Next.js + Bun**: Maintain the Bun package resolution lock (`bun.lock`) and Next.js App Router structure.
* **Use NEXT_PUBLIC_API_URL**: Resolve all HTTP interactions to the API gateway URL through this variable.
* **Centralize API Calls**: Avoid scattering fetch logic throughout page trees; utilize `src/lib/api/*` modules.
* **Use API Envelope**: Parse all incoming payload wrappers via `ApiResponse<T>` or `PagedResponse<T>` wrappers.
* **Use Role-Based Guards**: Secure pages using client-side layouts and route protection layers matching student, lecturer, or admin roles.
* **Keep Mock Mode Isolated**: Restrict mocking switches inside the client layer; visual pages should interact only with stores and client modules.
* **Run Bun Build**: Always run `bun run build` to confirm compiler compatibility before delivering features.
* **Document Changed Routes**: Keep route files and documentation files in sync.

## Don't

* **Don't Hardcode Service URLs**: Never use internal microservice hostnames/ports (e.g., `localhost:5001`). Access everything via the API Gateway.
* **Don't Call Backend Services Directly**: Maintain requests flowing through the API Gateway (`http://localhost:8080`).
* **Don't Invent API Fields**: Use structures matching the exact fields specified in backend schemas.
* **Don't Rewrite Whole App**: Build on top of the established layout, CVA buttons, and Tailwind configurations.
* **Don't Mix Mock Logic Into Pages**: Avoid using logic like `if (isMock) { ... }` in page components.
* **Don't Add Random UI Libraries**: Keep dependencies clean and utilize the configured shadcn primitives.
* **Don't Break Existing Styling System**: Respect Tailwind CSS v4 directives and oklch theme definitions in `src/app/globals.css`.

## Important API Contract Summary

### Auth Endpoints
* `POST /api/auth/register` - Create user credentials.
* `POST /api/auth/login` - Obtain credentials token.
* `GET /api/users/me` - Resolve active user details.

### System Roles
* `student`
* `lecturer`
* `admin`

### Response Envelope Structure
```typescript
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

## Taste Skill Integration

Future frontend agents must use Taste Skill principles when implementing the user interface:
* **Avoid generic AI-looking layouts**: Avoid huge empty spans, massive glowing blobs, and standard dark/light boilerplate card borders.
* **Improve visual hierarchy**: Contrast fonts, weights, and muted labels to guide user focus.
* **Use better spacing rhythm**: Keep layout components strictly bounded using uniform paddings and gaps.
* **Use cleaner typography**: Rely on font variables `--font-sans` and `--font-mono` defined in the layout configuration.
* **Make dashboards feel polished and intentional**: Provide clean panels, table headers, actions, and status blocks.
* **Use restrained motion**: Limit animations to micro-interactions (e.g. subtle buttons, hover lists). Do not use intrusive viewport entry fade-ins.
* **Avoid random gradients/glows**: Ensure colors serve to delineate information rather than decorative excess.
* **Keep UI professional, minimal, and premium**: Keep layouts aligned to corporate ASP.NET grading system tool aesthetics.
