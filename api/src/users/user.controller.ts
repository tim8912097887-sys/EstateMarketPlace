import { Request, Response } from "express"
import { asyncErrorHandler } from "../utilities/asyncErrorHandler.js"
import { createUser, findUser, loginUser } from "./user.service.js";
import { AppError } from "../utilities/customError.js";
import { generateToken } from "../utilities/generateToken.js";
import { env } from "../configs/env.js";
import { verifyToken } from "../utilities/verifyToken.js";

export const signupUser = asyncErrorHandler(async(req: Request,res: Response) => {
    const { email } = req.body;
    const existUser = await findUser(email);
    if(existUser) throw new AppError("Duplicate",409,"User already exist",true);
    const user = await createUser(req.body);
    res.json({ success: true,data: { user } });
})

export const signinUser = asyncErrorHandler(async(req: Request,res: Response) => {
    const user = await loginUser(req.body);
    if(!user) throw new AppError("Credential Error",400,"Email or password is not correct",true);
    const payload = { sub: user.id,username: user.username };
    const accessToken = generateToken(payload,true);
    const refreshToken = generateToken(payload,false);

    const data = { user,accessToken };
    res.cookie("refreshToken",refreshToken,{
       // Prevent frontend access
       httpOnly: true,
       sameSite: 'lax',
       // Same as refresh token    
       maxAge: Number(env.COOKIE_REFRESH_EXPIRATION),
       // Only allow https in production   
       secure: env.NODE_ENV==="production",
       // Only be send in the user endpoint   
       path: "/users"
    });
    res.json({ success: true,data });
})

export const logoutUser = asyncErrorHandler(async(req: Request,res: Response) => {
    // The config option must match
    res.clearCookie("refreshToken",{
       httpOnly: true,
       sameSite: 'lax',   
       secure: env.NODE_ENV==="production", 
       path: "/users"
    });
    res.json({ success: true,message: "Loggout" });
})

export const refreshUser = asyncErrorHandler(async(req: Request,res: Response) => {
    const { refreshToken } = req.cookies;
    const decode = verifyToken(refreshToken,false);
    const payload = { sub: decode.sub,username: decode.username };
    const accessToken = generateToken(payload,true);
    // Refresh token rotation
    const newRefreshToken = generateToken(payload,false);
    const data = { accessToken };
    res.cookie("refreshToken",newRefreshToken,{
       // Prevent frontend access
       httpOnly: true,
       sameSite: 'lax',
       // Same as refresh token    
       maxAge: Number(env.COOKIE_REFRESH_EXPIRATION),
       // Only allow https in production   
       secure: env.NODE_ENV==="production",
       // Only be send in the user endpoint   
       path: "/users"
    });
    res.json({ success: true,data });

})