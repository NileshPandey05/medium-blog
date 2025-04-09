import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { genSaltSync, hash, hashSync } from 'bcrypt-ts';
import { jwt, sign } from 'hono/jwt';
import { cors } from 'hono/cors';

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

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  try {
    const existingUser = await prisma.user.findUnique({
      where:{
        email: body.email
      }
    })

    if(existingUser){
      return c.json({message: "User is already exist"}, 409)
    }

    const password = await hash(body.password, 10)
    console.log(password)
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: password
      }
    })

    const token = await sign({id: user.id}, c.env.JWT_SECRET)
    console.log(user)
    // return c.json({message : 'user is created'}, 403)
    return c.json({ token }, 201)

  
  } catch (error) {
    return c.json({ error: 'Something went wrong while signing up' }, 500)

  }
})

app.post('/api/v1/signin', async (c) => {

})

app.post('/api/v1/blog', async (c) => {

})

app.put('/api/v1/blog', async (c) => {

})

app.get('/api/v1/blog/:id', async (c) => {

})

app.get('/api/v1/blog/bulk', async (c) => {

})

export default app
