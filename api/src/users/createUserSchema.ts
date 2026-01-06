import * as z from "zod";
import validator from 'validator';
import { sanitizer } from "../utilities/sanitizer.js";

export const CreateUserSchema = z.strictObject({
    username: z
    .string("Username must be string")
    // Remove extra space
    .trim()
    .min(2,"Username at least two characters")
    // Prevent slow down by large data
    .max(50,"Username at most fifty characters")
    // Prevent xss attack
    .transform(sanitizer),
    email: z
    .string("Email should be string")
    // Some emails are case insensitive,prevent duplicate create 
    .toLowerCase()
    // Use third party library instead of regex is more robust
    .refine((val) => validator.isEmail(val),"Invalid Email")
    // Remove extra space
    .trim()
    .transform((val) => validator.normalizeEmail(val) || val),
    // Same criteria as database
    password: z
    .string("Password must be string")
    .min(6,"Password at least six characters")
    // Fail fast for length,prevent regex dos attack
    .max(50,"Password at most fifty characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,"Password required one lowercase,uppercase alpha,number and special character"),
    avatar: z.optional(z
    .string("Image URL must be string")
    // Check if valid
    .refine((val) => validator.isURL(val,{ require_protocol: true }),"Invalid Image URL")
    // Check extension
    .refine((val) => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].some(ext => val.split("?")[0].toLowerCase().endsWith(`${ext}`))))
})

export type CreateUserType = z.infer<typeof CreateUserSchema>;