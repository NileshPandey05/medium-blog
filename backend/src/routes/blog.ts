import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, genSaltSync, hash, hashSync } from 'bcrypt-ts';
import { jwt, sign, verify } from 'hono/jwt';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string | " "
  }
}>()

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization") || ""
  const token = header.split(" ")[1]
  const response = await verify(token, c.env.JWT_SECRET)

  if(response.id){
    c.set("userId", response.id)
    await next()
  }else{
    return c.json({error: "unauthorized token"}, 403)
  }
})

blogRouter.post('/blog', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const userId = c.get("userId")

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            published: body.published,
            authorId: userId
        }
    })

})

blogRouter.put('/blog', async (c) => {

})

blogRouter.get('/blog/:id', async (c) => {

})

blogRouter.get('/blog/bulk', async (c) => {

})
