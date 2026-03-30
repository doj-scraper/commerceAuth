# Repository Guidelines

## Project Structure
- `app/` contains the Next.js App Router entry points, including the landing page, catalog, features, auth routes, and API routes.
- `components/` holds shared UI pieces. Keep catalog, layout, auth-adjacent, and utility components here instead of duplicating them in pages.
- `lib/` contains shared helpers such as `lib/prisma.ts` and common utilities.
- `prisma/` holds the database schema, seed script, and catalog generation helpers. Treat it as the source of truth for data modeling.
- `USEFULUI/` is local reference material only. Do not treat it as primary application code or commit its contents.

## Build and Validation
- `npm run dev` starts the local Next.js development server.
- `npm run build` creates the production build.
- `npm run start` runs the built app locally.
- `npm run lint` runs ESLint across the repo.
- `npx tsc --noEmit` validates the TypeScript program.
- `npx next build --webpack` is the preferred production validation check in this repo.

## Coding Style
- Use TypeScript, 2-space indentation, and functional React components.
- Prefer PascalCase for components, camelCase for variables and functions, and lowercase route folder names that follow Next.js conventions.
- Keep server-only logic in route handlers, Prisma helpers, or other `lib/` modules.
- Keep UI code in `app/` and `components/`.
- Follow the existing CellTech visual system: neutral surfaces, green accent, compact industrial typography, and restrained motion.

## Auth and Commerce Notes
- Clerk is wired through `ClerkProvider`, `proxy.ts`, sign-in/sign-up routes, and server-side `auth()` checks.
- Stripe checkout and order history are protected server-side and depend on authenticated sessions.
- Neon and Prisma remain the system of record for catalog, cart, and order persistence.

## Testing and Review
- Verify UI changes with lint, typecheck, and production build before claiming completion.
- Prefer browser QA for mobile or layout-sensitive work.
- If you change auth, checkout, or database behavior, validate the actual flow end to end.

## Commit Guidance
- Use concise conventional commit prefixes such as `feat:`, `fix:`, `docs:`, and `style:`.
- Keep commits focused on one user-facing change.
- Pull requests should summarize the change and list validation steps.
