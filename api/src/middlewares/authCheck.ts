import { asyncErrorHandler } from "../utilities/asyncErrorHandler.js";
import { NextFunction, Request,Response } from "express"
import { verifyToken } from "../utilities/verifyToken.js";

export const authCheck = asyncErrorHandler(async(req: Request,res: Response,next: NextFunction) => {
      const bearerToken = req.headers?.['authorization'];
      // Unauth error handle by controller  
      if(!bearerToken) return next();
      const token = bearerToken.split(" ")[1];
      if(token) {
         const decode = verifyToken(token,true);
         // Pass through user property if token is correct 
         req.user = decode;
      }
      return next();
})