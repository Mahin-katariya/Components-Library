# UI Component Library —

A small but complete Next.js project built to crystallise fundamentals. Four showcase components (Quotes, Users, Jokes, Cats), a component request system, a real database, cloud image storage, and a live deployment. Built from scratch, grilled over every decision.

**Live:** [your-project.vercel.app](https://components-topaz-nine.vercel.app)  
**Stack:** Next.js 15 · TypeScript · Prisma · Neon · Cloudinary · Tailwind CSS

---

## What this project demonstrates

| Concept | Where |
|---|---|
| File-based routing | Every `page.tsx` in `app/` |
| Nested layouts | `app/layout.tsx` wrapping all routes |
| Server Components | All page files by default |
| Client Components | `QuoteSwiper`, `JokeViewer`, `CatSwiper`, `AvatarStack`, `Navbar` |
| SSG | `/quotes`, `/jokes`, homepage — `cache: "force-cache"` |
| SSR | `/requests` — `cache: "no-store"` |
| CSR | `CatSwiper` — client-side fetch on each swipe |
| API Routes | All `/api/*` endpoints — GET and POST |
| Server Actions | `submitRequest()` — component request form |
| Database integration | Prisma + Neon (serverless PostgreSQL) |
| Cloud image storage | Cloudinary — cat images and user avatars |
| Structured API responses | Consistent `{ status, data }` shape across all endpoints |
| Error handling | `try/catch` in every route handler |
| Seed scripts | `prisma/seed.ts` — repeatable data population |
| Deployment | Vercel + production migrations |

---

## The four components

| Component | Data | Rendering | Interaction |
|---|---|---|---|
| Quote Swiper | Quotes from DB | SSG | Click to tear the card away, new quote drops in |
| Avatar Stack | Users from DB | SSG | Hover to reveal name and bio tooltip |
| Joke Viewer | Jokes from DB | SSG | Navigate cards, click divider to reveal punchline |
| Cat Swiper | Cats from DB | CSR | Drag or swipe through cat image cards |

---

## Concepts learned

### 1. Next.js App Router vs Pages Router

The Pages Router treated everything as client-side by default and used `_app.js` workarounds for layouts. The App Router flipped the default — every component is a Server Component unless you explicitly add `"use client"`. This means static content ships as plain HTML with zero JavaScript, and JavaScript only gets sent for components that actually need interactivity.

File-based routing works the same way in both — a file named `page.tsx` becomes a route automatically. But in the App Router, `layout.tsx` is a proper first-class layout system that wraps child routes without re-rendering on navigation.

```
app/
├── layout.tsx          ← wraps every page — Navbar + Footer live here
├── page.tsx            ← becomes /
├── quotes/
│   └── page.tsx        ← becomes /quotes
└── requests/
    └── new/
        └── page.tsx    ← becomes /requests/new
```

---

### 2. Server Components vs Client Components

The boundary between server and client is the most important concept in the App Router.

**Server Components** run only on the server. They can be `async`, fetch from databases directly, and never send their code to the browser. No `useState`. No `useEffect`. No browser APIs.

**Client Components** run in the browser. They handle interactivity, animations, and user events. Marked with `"use client"` at the top of the file.

The pattern used throughout this project — a Server Component fetches data and passes it as props to a Client Component that handles the UI:

```tsx
// Server Component — fetches at build time
export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany()
  return <QuoteSwiper quotes={quotes} />  // passes data down
}

// Client Component — handles interactivity
"use client"
export function QuoteSwiper({ quotes }) {
  const [index, setIndex] = useState(0)
  // ... swipe logic
}
```

The rendering strategy (SSG/SSR/CSR) is determined by how you fetch data, not by where the file lives.

---

### 3. Rendering Strategies

**SSG (Static Site Generation)** — data fetched once at build time. Same HTML served to everyone. Fastest possible delivery. Used for quotes, jokes, and the homepage because the data rarely changes.

```tsx
const res = await fetch('/api/quotes', { cache: "force-cache" })
```

**SSR (Server Side Rendering)** — page rebuilt on every request. Fresh data every time. Used for the requests list because new submissions need to appear immediately.

```tsx
const res = await fetch('/api/requests', { cache: "no-store" })
```

**CSR (Client Side Rendering)** — browser fetches data after the page loads. Used for CatSwiper because each swipe needs a fresh random cat from the API.

```tsx
// inside a Client Component
useEffect(() => { fetch('/api/cats/random').then(...) }, [])
```

The key insight: SSG and CSR are not mutually exclusive. A page can be SSG (data fetched at build time) while containing a Client Component that fetches additional data in the browser. The page itself is static. The interactive layer on top is dynamic.

---

### 4. API Routes vs Server Actions

Both run on the server. The difference is who can call them.

**API Routes** are HTTP endpoints with a URL. Anyone can call them — a browser, a mobile app, Postman, another server. Used for all data reads in this project because the data could theoretically be consumed by anything.

```typescript
// app/api/quotes/route.ts
export async function GET() {
  const quotes = await prisma.quote.findMany()
  return NextResponse.json({ status: "success", data: quotes })
}
```

**Server Actions** are functions marked with `"use server"`. They have no URL. Only your own Next.js app can call them, directly from a form or component. Next.js handles the HTTP plumbing invisibly. Used for the component request form because only this app will ever submit requests — no need for a public endpoint.

```typescript
// actions/requests.ts
"use server"
export async function submitRequest(formData: FormData) {
  await prisma.componentRequest.create({ data: { ... } })
}

// form wires directly to the function — no fetch needed
<form action={submitRequest}>...</form>
```

The rule: reads go through API Routes (public, accessible). Writes triggered by your own UI go through Server Actions (internal, no URL exposed).

---

### 5. Structured API Responses

Every API endpoint returns the same shape regardless of what happened. Consumers never have to guess the structure.

```typescript
// success
return NextResponse.json(
  { status: "success", data: quotes },
  { status: 200 }
)

// not found
return NextResponse.json(
  { status: "fail", message: "Quote not found" },
  { status: 404 }
)

// server error
return NextResponse.json(
  { status: "error", message: "Failed to fetch quotes" },
  { status: 500 }
)
```

The HTTP status code and the response body must always agree. Returning `{ status: "error" }` with a `200` HTTP status is a contradiction — the HTTP status is the first thing every client checks.

---

### 6. Error Handling with try/catch

Every API route talks to something outside itself — a database over a network. That database can be temporarily down, slow, or unreachable. Without a safety net, one failure exposes your stack trace to the world and crashes the handler.

```typescript
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany()
    return NextResponse.json({ status: "success", data: quotes })
  } catch (error) {
    console.error(error)  // log privately on the server
    return NextResponse.json(
      { status: "error", message: "Failed to fetch quotes" },
      { status: 500 }
    )
  }
}
```

`await` doesn't throw — Prisma does. `await` just delivers whatever Prisma gives back — a value if it succeeded, an error if it failed. The `try/catch` wraps the code that can throw, not `await` itself.

---

### 7. Prisma + Neon

Prisma is an ORM — it reads your schema, generates a fully typed client, and handles migrations. You never write SQL directly.

```prisma
model Quote {
  id        String   @id @default(cuid())
  text      String
  author    String
  createdAt DateTime @default(now())
}
```

The singleton pattern in `lib/prisma.ts` prevents connection pool exhaustion during development. Next.js Hot Reload clears the module cache and re-runs files, which would create a new PrismaClient on every save. `globalThis` survives the module cache clear, so the client is created once and reused.

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

Neon is serverless PostgreSQL. The `PrismaNeon` adapter uses HTTP-based connections instead of persistent TCP — necessary for serverless environments like Vercel where connections can't be kept alive between function invocations.

---

### 8. Cloud Object Storage

Images don't belong in a database. A database row is ~200 bytes. A cat image is ~3MB. Storing images in PostgreSQL would make every query slower, cost far more per GB, and prevent images from being served from CDN nodes close to the user.

The correct pattern — store only the URL in the database, store the actual file in Cloudinary:

```
PostgreSQL:  { id: "abc", name: "Whiskers", imageUrl: "https://res.cloudinary.com/..." }
Cloudinary:  cat1.jpg → [actual image bytes]
```

Your app queries the database for the URL string. The browser fetches the image directly from Cloudinary's CDN. Your server is never involved in image delivery.

Next.js `<Image>` requires the domain to be whitelisted in `next.config.ts` because it fetches and optimises images server-side before serving them. Without the config, Next.js refuses to load from external domains.

---

### 9. Environment Variables

Secrets — database passwords, API keys — never go in code. Code travels everywhere (GitHub, logs, colleagues' machines). Secrets stay in `.env` locally and in the platform's secret store in production.

```
DATABASE_URL=postgresql://...   ← server only, never reaches the browser
NEXT_PUBLIC_URL=https://...     ← safe to expose, baked into browser bundle
```

Next.js enforces this with a naming convention. Variables without `NEXT_PUBLIC_` prefix are stripped from the browser bundle entirely — physically impossible to leak through the frontend. Variables with `NEXT_PUBLIC_` are replaced with their literal values at build time and included in the browser bundle.

---

### 10. Seed Scripts

A seed script is a one-time script that populates your database with initial data. Run it once, all tables are full. Reset the database, run it again — same result every time.

```typescript
async function main() {
  await prisma.quote.deleteMany()  // clear first — makes it idempotent
  await prisma.quote.createMany({
    data: [ { text: "...", author: "..." }, ... ]
  })
}

main()
  .then(() => console.log("done"))
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())
```

`createMany` inserts all records in one database round trip instead of looping `create`. `$disconnect()` in `finally` closes the connection whether the script succeeded or failed — like hanging up the phone regardless of how the call went.

---

### 11. Hot Reload

Hot Reload watches your files and pushes changes to the browser without a full page reload. Next.js's version (Fast Refresh) preserves React component state during updates — you stay on step 3 of a form while tweaking a button colour.

It works by keeping a live WebSocket connection between the browser and the dev server. When a file changes, only the changed module gets swapped — the rest of the page stays alive.

This is why the Prisma singleton exists. Hot Reload clears Node.js's module cache to push in fresh code, which causes `lib/prisma.ts` to re-execute and create a new PrismaClient. Without `globalThis`, you'd accumulate connection pools with every file save and eventually hit the database's connection limit.

---

### 12. FormData

FormData is a built-in browser object that packages form inputs as key-value pairs. The browser builds it automatically when a form is submitted — every `<input>`, `<select>`, and `<textarea>` with a `name` attribute becomes a key.

```tsx
<form action={submitRequest}>
  <input name="email" />           // key: "email"
  <select name="componentType" />  // key: "componentType"
  <textarea name="description" />  // key: "description"
</form>
```

In a Server Action, FormData arrives as the argument. You read values with `.get()`:

```typescript
const email = formData.get("email") as string
```

The `name` attribute is the key. Without it, the browser ignores that field entirely when building the FormData package.

---

### 13. Deployment on Vercel

Vercel is serverless — each request spins up a fresh function, runs it, and tears it down. There's no persistent server process. This is why persistent TCP database connections don't work and why the Neon serverless adapter (HTTP-based connections) is the right choice.

`migrate deploy` applies existing migrations to production. `migrate dev` creates new migrations. Never run `migrate dev` in production — it's designed for development only.

Environment variables set in the Vercel dashboard are injected into `process.env` at runtime — same code, different values per environment, zero secrets in the repository.

---

## Conscious decisions and skipped concepts

| Skipped | Reason | How to revisit |
|---|---|---|
| PUT/PATCH | No auth = any user can mutate any record | Build a separate Express project focused on HTTP verb semantics |
| DELETE | Same auth concern | Same as above |
| ISR | Deferred to keep scope tight | Add `export const revalidate = 60` to any page to enable it |
| Authentication | Would double project complexity | Next Auth or Clerk as a dedicated next project |
| Admin UI | Seed scripts + Postman sufficient for learning | Add a password-protected `/admin` route |

---

## Project structure

```
app/
├── layout.tsx                ← Navbar + Footer, font variables
├── page.tsx                  ← Homepage, SSG, Promise.all fetch
├── quotes/page.tsx           ← SSG
├── users/page.tsx            ← SSG
├── jokes/page.tsx            ← SSG
├── cats/page.tsx             ← CSR shell
├── requests/
│   ├── page.tsx              ← SSR
│   └── new/page.tsx          ← SSG + Server Action
└── api/
    ├── quotes/route.ts       ← GET all, POST
    ├── quotes/[id]/route.ts  ← GET single
    ├── users/route.ts
    ├── jokes/route.ts
    ├── cats/route.ts
    ├── cats/random/route.ts  ← used by CatSwiper CSR fetch
    └── requests/route.ts     ← GET all

components/
├── Navbar.tsx                ← "use client" — usePathname for active link
├── Hero.tsx                  ← Server Component
├── Footer.tsx                ← Server Component
├── showcase/
│   └── ShowcaseSection.tsx   ← two-col info + stage layout
├── QuoteSwiper.tsx           ← "use client"
├── AvatarStack.tsx           ← "use client"
├── JokeViewer.tsx            ← "use client"
├── CatSwiper.tsx             ← "use client"
└── RequestForm.tsx           ← "use client"

actions/
└── requests.ts               ← "use server" submitRequest()

lib/
└── prisma.ts                 ← singleton client with PrismaNeon adapter

prisma/
├── schema.prisma             ← models + ComponentType enum
└── seed.ts                   ← repeatable data population
```

---

## Running locally

```bash
# install dependencies
pnpm install

# set up environment variables
cp .env.example .env
# fill in DATABASE_URL, CLOUDINARY_*, NEXT_PUBLIC_URL

# run database migrations
pnpm dlx prisma migrate dev

# seed the database
pnpm run db:seed

# start dev server
pnpm run dev
```

Open `http://localhost:3000`.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components, file routing, Server Actions |
| Language | TypeScript | Type safety across DB → API → UI |
| Database | Neon (serverless PostgreSQL) | Serverless-native, free tier, works perfectly on Vercel |
| ORM | Prisma | Type-safe queries, schema-driven migrations |
| Cloud Storage | Cloudinary | Images stored and served via CDN, not in the database |
| Styling | inline styles | Utility-first, scoped where needed |
| Deployment | Vercel | Native Next.js platform, automatic GitHub deploys |
