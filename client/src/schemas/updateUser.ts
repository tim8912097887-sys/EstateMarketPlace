import * as z from "zod";

export const UpdateUserSchema = z.strictObject({
    username: z.optional(
    z.string("Username must be string")
    // Remove extra space
    .trim()
    .min(2,"Username at least two characters")
    // Prevent slow down by large data
    .max(50,"Username at most fifty characters")),
    email: z.optional(
    z.string("Email should be string")
    // Some emails are case insensitive,prevent duplicate create 
    .toLowerCase()
    // Remove extra space
    .trim()),
    // Same criteria as database
    password: z.optional(
    z.string("Password must be string")
    .min(6,"Password at least six characters")
    // Fail fast for length,prevent regex dos attack
    .max(50,"Password at most fifty characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,"Password required one lowercase,uppercase alpha,number and special character"))
})

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;