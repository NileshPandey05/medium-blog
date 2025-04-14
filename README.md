# 📝 Blog Post API - Serverless with Cloudflare Workers

This is a **simple blog post backend** project built using:

- **Cloudflare Workers** as a serverless compute backend
- **Prisma Accelerate** for connection pooling
- **PostgreSQL** as the primary database
- **Hono** framework for routing and middleware
- **JWT Authentication** for user-based access control

---

## 🚀 Features

- User authentication (signup/signin)
- JWT-based protected routes
- Create, Read, and Update blog posts
- Input validation using `zod`
- Cloudflare Workers optimized with `@prisma/client/edge` and `@prisma/extension-accelerate`

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| [Cloudflare Workers](https://workers.cloudflare.com/) | Serverless backend |
| [Prisma Accelerate](https://www.prisma.io/docs/guides/deployment/accelerate) | Connection pooling for serverless |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Hono](https://hono.dev/) | Lightweight web framework |
| [Zod](https://github.com/colinhacks/zod) | Input validation |
| [bcrypt-ts](https://www.npmjs.com/package/bcrypt-ts) | Password hashing |
| [JWT](https://github.com/honojs/jwt) | Authentication middleware |

---

## Some Basic Command 

# 1. For initialize backend with Hono

```
npm create hono@latest my-app
cd my-app
npm i
```
for docs https://hono.dev/docs/getting-started/cloudflare-workers

# 2. Get your postgres url from any online provider

- https://neon.tech/
- https://supabase.com/

# 3.  Initialize DB (prisma)

- Get connection pool URL from Prisma accelerate

Link:- https://www.prisma.io/data-platform/accelerate

# 4 Initialize prisma in your project
``` 
npm i prisma
npx prisma init
```

# 5 After cerating your schema run this command
```
npx prisma migrate dev --name init_schema
npx prisma generate --no-engine
npm install @prisma/extension-accelerate
```

# 6 Initialize the prisma client
```
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())
```