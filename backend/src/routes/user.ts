import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, genSaltSync, hash, hashSync } from 'bcrypt-ts';
import { jwt, sign, verify } from 'hono/jwt';
// import { Bindings } from "hono/types";
import { signinInputSchema, signupInputSchema } from "@nilesh05/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const { success } = signupInputSchema.safeParse(body)
  if(!success){
    return c.text("Input are not correct", 411)
  }

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

userRouter.post('signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body = await c.req.json()
  const {success} = signinInputSchema.safeParse(body)
  if(!success){
    return c.text("Input are not correct", 411)
  }

  try {
    const existUser = await prisma.user.findUnique({
      where:{
        email: body.email
      }
    })
  
    if(!existUser){
      return c.text("User not found", 404)
    }

    const password = await compareSync(body.password, existUser.password)

    if(password){
      const jwt = await sign({id: existUser.id}, c.env.JWT_SECRET)
      return c.json({token : jwt})
    }else{
      return c.text("You have entered wrong password", 401)
    }
  } catch (error) {
    return c.json({error: "Error while signin"}, 404)
  }
})