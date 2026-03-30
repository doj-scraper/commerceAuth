# CellTech B2B ERP & Catalog

A modern, high-performance wholesale cellphone parts distribution platform built for enterprise repair centers.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless Database)
- **ORM:** Prisma 7 with `@prisma/adapter-neon`
- **Auth:** Clerk
- **Payments:** Stripe Checkout + webhook fulfillment
- **Styling:** Tailwind CSS with an industrial, dark-themed UI pattern

## Features
- **Data-Driven Catalog:** Dense data-grid displaying Golden SKUs, stock levels, and quality badges.
- **Smart Taxonomy:** Instant filtering by Brand, Device Generation, Part Category (Bucket), and Quality (OEM/Refurbished).
- **Serverless API:** Highly optimized API routes for querying the catalog and fetching product compatibility using Neon.
- **Authenticated Commerce Flow:** Clerk-backed account protection, server actions for cart state, Stripe checkout, and order history.
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
- `app/api/parts/route.ts`: Catalog API returning filtered parts and faceted metadata.
- `app/api/stripe/checkout/route.ts`: Authenticated Stripe Checkout session creation with final inventory validation.
- `app/api/webhooks/clerk/route.ts`: Clerk webhook sync into PostgreSQL.
- `app/api/webhooks/stripe/route.ts`: Stripe fulfillment webhook that creates orders, snapshots line items, decrements stock, and clears carts.
- `app/actions/cart.actions.ts`: Server actions for cart reads and mutations.
- `app/actions/order.actions.ts`: Server action for authenticated order history reads.
- `app/(shop)/catalog/page.tsx`: Catalog route for the B2B explorer.
- `app/(account)/orders/page.tsx`: Authenticated order history route.
