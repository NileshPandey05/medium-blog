import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compare, hash } from 'bcrypt-ts';
import { sign } from 'hono/jwt';
import { signinInputSchema, signupInputSchema } from "@nilesh05/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Signup route
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const parsed = signupInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 411);
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: parsed.data.username,
      },
    });

    if (existingUser) {
      return c.json({ message: "User already exists" }, 409);
    }

    const hashedPassword = await hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.username,
        password: hashedPassword,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ token }, 201);
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: 'Something went wrong while signing up' }, 500);
  }
});

// Signin route
userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const parsed = signinInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 411);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsed.data.username,
      },
    });

    if (!existingUser) {
      return c.text("User not found", 404);
    }

    const isPasswordCorrect = await compare(body.password, existingUser.password);

    if (isPasswordCorrect) {
      const token = await sign({ id: existingUser.id }, c.env.JWT_SECRET);
      return c.json({ token });
    } else {
      return c.text("Incorrect password", 401);
    }
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ error: "Error while signing in" }, 500);
  }
});
