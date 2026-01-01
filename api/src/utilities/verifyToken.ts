import jwt from "jsonwebtoken";
import { env } from "../configs/env.js";
import { AppError } from "./customError.js";

type Payload = {
    sub: string
    username: string 
}

export const verifyToken = (token: string,isAccess: boolean) => {
    const secret = isAccess?env.ACCESS_TOKEN_SECRET:env.REFRESH_TOKEN_SECRET;
    try {
        const decode = jwt.verify(token,secret,{ algorithms: ["HS256"] }) as Payload;
        return decode;
    } catch (error) {
        console.error(`Token Verify Error: ${error}`);
        throw new AppError("Invalid token",401,"Unauthenticated",true);
    }
}