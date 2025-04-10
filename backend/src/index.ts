import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, genSaltSync, hash, hashSync } from 'bcrypt-ts';
import { jwt, sign, verify } from 'hono/jwt';
import { cors } from 'hono/cors';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

app.use(
  cors({
    origin: "http://127.0.0.1.8787/"
  })
)



app.get('/', (c) => {
  return c.text('Hello world!')
})

app.route("/api/v1/user", userRouter)
app.route("/api/v1/blog", blogRouter)



export default app
