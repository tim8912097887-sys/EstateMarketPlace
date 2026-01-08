import { AppError } from "../utilities/customError.js";
import { env } from "./env.js";

export const corsOption = {
    origin: (origin: string,callback: (err: (null | Error),isSuccess: (boolean | undefined)) => void) => {
        // Allow request with no origin like mobile phone...
        if(!origin) return callback(null,true);
        const whiteList = env.WHITELIST.split(",") || [];
        // Whitelist check
        if(whiteList.indexOf(origin) !== -1) {
            callback(null,true);
        } else {
            callback(new AppError("CORS Error",403,"The origin is not allowed by CORS",true),undefined);
        }
    },
    methods: ['GET','POST','OPTIONS','DELETE','PUT'],
    // Allow cookies to be sent
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    // Tell browser to cache preflight for 10 minutes (Chrome limit
    maxAge: 600,
    preflightContinue: false,
    // Some legacy browsers (IE11) choke on 204
    optionsSuccessStatus: 204

}