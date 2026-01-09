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
    const payload = { sub: user._id.toString(),username: user.username };
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
       // Allow all endpoint  
       path: "/"
    });
    res.status(200).json({ success: true,data });
})

export const logoutUser = asyncErrorHandler(async(req: Request,res: Response) => {
    // The config option must match
    res.clearCookie("refreshToken",{
       httpOnly: true,
       sameSite: 'lax',   
       secure: env.NODE_ENV==="production", 
       path: "/"
    });
    res.status(200).json({ success: true,message: "Loggout Success" });
})

export const refreshUser = asyncErrorHandler(async(req: Request,res: Response) => {
    const { refreshToken } = req.cookies;
    const decode = verifyToken(refreshToken,false);
    const user = await findUserById(decode.sub);
    // Handle user missing error
    if(!user) throw new AppError("Not Found",404,"User Not Found",true);
    const payload = { sub: decode.sub,username: decode.username };
    const accessToken = generateToken(payload,true);
    // Refresh token rotation
    const newRefreshToken = generateToken(payload,false);
    const data = { accessToken,user };
    res.cookie("refreshToken",newRefreshToken,{
       // Prevent frontend access
       httpOnly: true,
       sameSite: 'lax',
       // Same as refresh token    
       maxAge: Number(env.COOKIE_REFRESH_EXPIRATION),
       // Only allow https in production   
       secure: env.NODE_ENV==="production",
       // Allow all endpoint  
       path: "/"
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
                // Allow all endpoint  
                path: "/"
            }
          ).status(statusCode).json({ success: true,data });
})

export const deleteUser = asyncErrorHandler(async(req: Request,res: Response) => {
    // Only owner of the user can delete itself
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
       path: "/"
    });
    res.status(200).json({ success: true,message: "Successfully delete" });
})

export const updateUser = asyncErrorHandler(async(req: Request,res: Response) => {

    // Only owner of the user can update itself
    if(!req.user || !req.user.sub) throw new AppError("Auth Error",401,"Unauthentication",true);
    const user = await findUserById(req.user.sub);
    if(!user) throw new AppError("Not Found Error",404,"User not found",true);
    // Provided value are Validate and Sanitize by middleware
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if(req.body.password) user.password = req.body.password;
    // Use save to validate data and hash password by mongodb
    const newUser = await user.save();
    const data = { user: newUser };
    // Send back updated user for immediatly update on client
    res.status(200).json({ success: true,data });
})