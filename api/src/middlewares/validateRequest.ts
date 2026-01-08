import * as z from "zod";
import { NextFunction,Request,Response } from "express";
import { AppError } from "../utilities/customError.js"

// Use a Union type to allow both raw objects and transformed/piped schemas
type ValidationSchema = z.ZodObject;

// Customize the validation for different schema
export const validateRequest = (schema: ValidationSchema) => ((req: Request,res: Response,next: NextFunction) => {
     const validatedBody = schema.safeParse(req.body);

     // Pass App error down if unsuccess 
     if(!validatedBody.success) {
        console.error(z.prettifyError(validatedBody.error));
        const inputError = new AppError("Invalid Input",400,validatedBody.error.issues[0].message,true);
        return next(inputError);
     }   
     // Overwrite the request body with validated and sanitized data
     req.body = validatedBody.data;
     return next();
})