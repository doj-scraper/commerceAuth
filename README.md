# CellTech B2B ERP & Catalog

A modern, high-performance wholesale cellphone parts distribution platform built for enterprise repair centers.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless Database)
- **ORM:** Prisma 7 with `@prisma/adapter-neon`
- **Styling:** Tailwind CSS with an industrial, dark-themed UI pattern

## Features
- **Data-Driven Catalog:** Dense data-grid displaying Golden SKUs, stock levels, and quality badges.
- **Smart Taxonomy:** Instant filtering by Brand, Device Generation, Part Category (Bucket), and Quality (OEM/Refurbished).
- **Serverless API:** Highly optimized API routes for querying the catalog and fetching product compatibility using Neon.
- **Vercel Ready:** Fully deployed and optimized for Vercel serverless environments using connection pooling.

## Local Development

### Prerequisites
- Node.js 20+
- A Neon PostgreSQL Database

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
   ```
4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Push the schema and seed the database:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture
- `prisma/schema.prisma`: The database schema including Brand, Model, Phone, PartType, PartMaster, and StockLedger.
- `prisma/seed.ts`: The database seeder that auto-generates structured inventory and SKUs.
- `app/api/parts/route.ts`: Catalog engine API returning properly filtered search indices and relational data.
- `app/(shop)/catalog/page.tsx`: The main user interface for the B2B catalog.
- `lib/prisma.ts`: Singleton instance for the Prisma Client configured with the Neon serverless adapter.
