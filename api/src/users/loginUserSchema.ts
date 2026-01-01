import * as z from "zod";
import validator from 'validator';

export const LoginUserSchema = z.strictObject({
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
       .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,"Password required one lowercase,uppercase alpha,number and special character")
})

export type LoginUserType = z.infer<typeof LoginUserSchema>;