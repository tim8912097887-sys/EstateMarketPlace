import { Request, Response } from "express"
import { asyncErrorHandler } from "../utilities/asyncErrorHandler.js"

export const signupUser = asyncErrorHandler(async(req: Request,res: Response) => {
    
    res.json({ success: true,message: "signupUser" });
})

export const signinUser = asyncErrorHandler(async(req: Request,res: Response) => {
    res.json({ success: true,message: "signinUser" });
})

export const logoutUser = asyncErrorHandler(async(req: Request,res: Response) => {
    res.json({ success: true,message: "logoutUser" });
})

export const refreshUser = asyncErrorHandler(async(req: Request,res: Response) => {
    res.json({ success: true,message: "refreshUser" });
})