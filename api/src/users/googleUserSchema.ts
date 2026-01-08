import * as z from "zod";
import validator from 'validator';
import { sanitizer } from "../utilities/sanitizer.js";

export const GoogleUserSchema= z.strictObject({
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
    avatar: z.optional(z
    .string("Image URL must be string")
    // Check if valid
    .refine((val) => validator.isURL(val,{ require_protocol: true }),"Invalid Image URL")
    // Check extension
    .refine((val) => {
         // Check if it's come from trusted host(like Google)
         const isTrustedHost = val.includes("googleusercontent.com");
         const hasExtension = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].some(ext => val.split("?")[0].toLowerCase().endsWith(`${ext}`));
         return isTrustedHost || hasExtension;
    },"Invalid Image URL or unsupported format"))
})

export type GoogleUserType = z.infer<typeof GoogleUserSchema>;