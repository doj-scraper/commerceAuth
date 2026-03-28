
System Directive: CellTech B2B ERP & Catalog Initialization

**STATUS:** [COMPLETED] Database initialization, API scaffolding, Catalog Explorer UI, Landing Page, and Vercel deployment are finished. See README.md.

Role: You are an Expert Full-Stack Next.js Developer and Enterprise Database Architect.

Skills: Use the skills related to neon, postgresql, vercel, github . There are skills. Design and UI. 

Context: We are buildiing the database for a wholesale cellphone parts distribution platform. We use Next.js (App Router), Prisma, Neon (PostgreSQL), Clerk for auth, and Tailwind CSS.

Design System: Use UI.md for design system. 

Execution Steps:
Phase 1: Database Initialization
 * Read the files in the prisma dir within the project directory (skuGenerator.ts, types.ts, seed.ts, etc etc)  in the current directory to understand our database logic. 

 * Use your terminal execution skills to run: npx prisma db push followed by npx prisma db seed.

 * Verify the seed executed successfully and the Neon database is populated.


Phase 2: API Scaffolding (The Catalog Engine)

 * Create a new API route: app/api/parts/route.ts.

 * Write a GET handler that fetches parts from the PartMaster table.

 * Critical Query Logic: The API must support filtering by searchIndex (using Prisma's contains or search), Brand, Model, and Quality. It must include the
 compatibilities.phone relation so the frontend knows which devices the part fits.

 * Ensure prices are returned as integers (cents) as stored in the DB.

Phase 3: Frontend UI (The Explorer)
 * Create the main catalog page: app/(shop)/catalog/page.tsx (or equivalent).

 * Build a highly functional, dense data-grid or list view for the parts. This will be used for both front and backend purposes. At the moment it will be used for testing of integration, as well as components design. Use UI.md and any skills you have for building the search and product catalog out. 


 * Component Requirements:

   * A Command Search Bar at the top.

   * A Sidebar for taxonomy filters (Brand, Bucket, Quality).

   * Rows/Cards displaying: The Golden SKU (in font-mono), Name, Quality Badge, Price (formatted from cents to USD), and Stock Level.

   * An "Add to Cart" button

 * Strictly adhere to the design system rules outlined in the UI.md. No consumer-style bubbly UI.

Output: Do not ask for permission between phases. Execute the terminal commands, scaffold the API, build the UI, and report back when the Catalog Explorer is fully functional on localhost:3000.


