import { Request,Response,NextFunction } from "express"
import { env } from "../configs/env.js"

const sendErrorDev = (err:any,res: Response) => {
    res.status(err.httpCode).json({
        success: false,
        message: err.message || "Something went wrong"
    })
}

const sendErrorPro = (err: any,res: Response) => {
    // Trusted error send the message
    if(err.isOperational) {
       res.status(err.httpCode).json({
          success: false,
          message: err.message
       })
    } else {
        console.error(`Unknown Error: ${err}`);
        // Don't leak the detail by sending generic message
       res.status(err.httpCode).json({
          success: false,
          message: "Something went wrong"
       })
    }
}

export default (err: any,req: Request,res: Response,next: NextFunction) => {
      // Define status code for unexpected error
      err.httpCode = err.httpCode || 500;

      if(env.NODE_ENV==="development") {
         sendErrorDev(err,res);
      } else {
         sendErrorPro(err,res);
      }
}