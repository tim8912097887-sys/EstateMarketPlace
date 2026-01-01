import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";
import { AppError } from "./customError.js";

type Payload = {
    sub: string
    username: string 
}

export const generateToken = (payload: Payload,isAccess: boolean) => {
     const secret = isAccess?env.ACCESS_TOKEN_SECRET:env.REFRESH_TOKEN_SECRET;
     try {
        // Explicitly assign the algorithm and short live for access token
       const token = jwt.sign(payload,secret,{ algorithm: "HS256",expiresIn: isAccess?env.ACCESS_TOKEN_EXPIRATION:env.REFRESH_TOKEN_EXPIRATION })
       return token;  
     } catch (error: any) {
       console.error(`Token Generate Error: ${error}`);
       throw new AppError("Token Error",500,"Something went wrong",true); 
     }
}