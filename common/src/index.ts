import z from "zod"

export const signupInputSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6).max(20),
})

export type SignupInput = z.infer<typeof signupInputSchema>

export const signinInputSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6).max(20),
})

export type SigninInput = z.infer<typeof signinInputSchema>

export const createPostInputSchema = z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean()
})
export type CreatePostInput = z.infer<typeof createPostInputSchema>

export const updatePostInputSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().optional()
})
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>