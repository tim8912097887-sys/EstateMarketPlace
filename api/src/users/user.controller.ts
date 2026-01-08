import { Request, Response } from "express"
import { asyncErrorHandler } from "../utilities/asyncErrorHandler.js"
import { createUser, findUser, findUserById, loginUser, userDelete } from "./user.service.js";
import { AppError } from "../utilities/customError.js";
import { generateToken } from "../utilities/generateToken.js";
import { env } from "../configs/env.js";
import { verifyToken } from "../utilities/verifyToken.js";

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const specialCharacters = [".","?","-","_"];

export const signupUser = asyncErrorHandler(async(req: Request,res: Response) => {
    const { email } = req.body;
    const existUser = await findUser(email);
    if(existUser) throw new AppError("Duplicate",409,"User already exist",true);
    const user = await createUser(req.body);
    res.status(201).json({ success: true,data: { user } });
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
    res.status(200).json({ success: true,data });
})

export const logoutUser = asyncErrorHandler(async(req: Request,res: Response) => {
    // The config option must match
    res.clearCookie("refreshToken",{
       httpOnly: true,
       sameSite: 'lax',   
       secure: env.NODE_ENV==="production", 
       path: "/users"
    });
    res.status(200).json({ success: true,message: "Loggout Success" });
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
    res.status(201).json({ success: true,data });

})

export const googleLogin = asyncErrorHandler(async(req: Request,res: Response) => {
       let statusCode;
       let payload;

       const { email } = req.body;
       let user = await findUser(email);
       if(!user) {
         const randomUpperAlpaNum = Math.floor(Math.random()*26);
         const randomLowerAlpaNum = Math.floor(Math.random()*26);
         const randomSpecialCharacterNum = Math.floor(Math.random()*4);
         const randomNumber = Math.floor(Math.random()*10);
         const upperAlpa = alphabet[randomUpperAlpaNum];
         const lowerAlpa = alphabet[randomLowerAlpaNum];
         const specialCharacter = specialCharacters[randomSpecialCharacterNum];
         const password = `${randomNumber}${upperAlpa.toUpperCase()}${lowerAlpa}${specialCharacter}${upperAlpa.toUpperCase()}${specialCharacter}`;
          user = await createUser({ ...req.body,password });
          payload = { sub: user._id.toString(),username: user.username };
          statusCode = 201;
       } else {
          console.log(user)
          payload = { sub: user._id.toString(),username: user.username };  
          statusCode = 200; 
       }
          const refreshToken = generateToken(payload,false);
          const accessToken = generateToken(payload,true);
          const data = { user,accessToken };
          res.cookie("refreshToken",refreshToken,
            {
                // Prevent frontend access
                httpOnly: true,
                sameSite: 'lax',
                // Same as refresh token    
                maxAge: Number(env.COOKIE_REFRESH_EXPIRATION),
                // Only allow https in production   
                secure: env.NODE_ENV==="production",
                // Only be send in the user endpoint   
                path: "/users"
            }
          ).status(statusCode).json({ success: true,data });
})

export const deleteUser = asyncErrorHandler(async(req: Request,res: Response) => {

    if(!req.user || !req.user.sub) throw new AppError("Auth Error",401,"Unauthentication",true);
    const user = await findUserById(req.user.sub);
    if(!user) throw new AppError("Not Found Error",404,"User not found",true);
    const deleteCount = await userDelete(req.user.sub);
    if(deleteCount < 1) throw new AppError("MongoDB Error",500,"Delete failed",true);
    // Clear the cookie when successfully delete
    res.clearCookie("refreshToken",{
       httpOnly: true,
       sameSite: 'lax',   
       secure: env.NODE_ENV==="production", 
       path: "/users"
    });
    res.status(200).json({ success: true,message: "Successfully delete" });
})