# CellTech B2B ERP & Catalog

A modern wholesale cellphone-parts platform built for repair operations that need live inventory, authenticated commerce, and a storefront that behaves like an operational sourcing surface.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless Database)
- **ORM:** Prisma 7 with `@prisma/adapter-neon`
- **Auth:** Clerk
- **Payments:** Stripe Checkout + webhook fulfillment
- **Styling:** Tailwind CSS with a neutral-first, green-accent CellTech visual system

## Features
- **Search-First Landing:** Single-screen home route with direct catalog entry and no footer on `/`.
- **Catalog Explorer:** URL-synced search plus filters for brand, model, bucket, and quality with mobile filter controls.
- **Commerce Surfaces:** Clerk-backed cart, Stripe Checkout session creation, Stripe webhook fulfillment, and authenticated order history.
- **Auth Entry Points:** Branded `/sign-in` and `/sign-up` routes plus header CTA access for new users.
- **Operational UI:** Refined features, catalog, orders, header, footer, and cart surfaces aligned to the same design system.
- **Reusable UI Primitives:** Shared section-intro and metric-tile components plus motion utilities with reduced-motion fallback.
- **Serverless API:** Highly optimized API routes for querying the catalog and fetching product compatibility using Neon.
- **Vercel Ready:** Optimized for serverless deployment with Neon pooling and Next.js proxy-based route protection.

## Local Development

### Prerequisites
- Node.js 20+
- A Neon PostgreSQL Database
- A Clerk application
- A Stripe account with webhook support

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require"
   DATABASE_URL_DIRECT="postgresql://user:password@endpoint.region.aws.neon.tech/neondb?sslmode=require"
   POSTGRES_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require"
   POSTGRES_PRISMA_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   CLERK_WEBHOOK_SECRET="whsec_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Push the schema and seed the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

### Validation
Run these checks before pushing changes:

```bash
npm run lint
npx tsc --noEmit
npx next build --webpack
```

## Architecture
- `prisma/schema.prisma`: Database schema for inventory, users, cart items, orders, and stock ledger records.
- `prisma/seed.ts`: Seeder that generates structured inventory and SKUs.
- `lib/prisma.ts`: Singleton Prisma client configured with the Neon serverless adapter.
- `proxy.ts`: Next.js 16 request protection layer that allows public routes and protects account/checkout flows through Clerk.
- `app/page.tsx`: Single-screen landing page and search entry surface.
- `app/api/parts/route.ts`: Catalog API returning filtered parts and faceted metadata.
- `app/api/stripe/checkout/route.ts`: Authenticated Stripe Checkout session creation with final inventory validation.
- `app/api/webhooks/clerk/route.ts`: Clerk webhook sync into PostgreSQL.
- `app/api/webhooks/stripe/route.ts`: Stripe fulfillment webhook that creates orders, snapshots line items, decrements stock, and clears carts.
- `app/actions/cart.actions.ts`: Server actions for cart reads and mutations.
- `app/actions/order.actions.ts`: Server action for authenticated order history reads.
- `app/(shop)/catalog/page.tsx`: Catalog route for the B2B explorer.
- `app/(account)/orders/page.tsx`: Authenticated order history route.
- `app/sign-in/[[...sign-in]]/page.tsx`: Branded Clerk sign-in route.
- `app/sign-up/[[...sign-up]]/page.tsx`: Branded Clerk sign-up route.
- `components/catalog/CatalogExplorer.tsx`: Search-first catalog surface with result cards and faceted filtering.
- `components/cart/CartDrawer.tsx`: Client cart drawer with quantity controls and checkout handoff.
- `components/ui/SectionIntro.tsx`: Shared section heading component for hero-like page intros.
- `components/ui/MetricTile.tsx`: Shared metric/stat card for operational summary panels.
- `app/globals.css`: Shared motion utilities and reduced-motion handling for UI transitions.
