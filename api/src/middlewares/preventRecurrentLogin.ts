import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../utilities/verifyToken.js";

export const preventRecurrentLogin = (req: Request,res: Response,next: NextFunction) => {
    // Check if token exist
    const token = req.cookies?.refreshToken || req.headers?.authorization?.split(" ")[1];
    const isAccess = req.cookies.refreshToken?false:true;
    if(token) {
       // Check duplicate login 
       try {
          verifyToken(token,isAccess);
          return res.status(409).json({
            success: false,
            message: "You already login"
          })
       } catch (error) {
          // If token is expired or invalid, let them proceed to the login logic
          return next();
       }
    } 
    // If no token just let it pass
    return next();
}