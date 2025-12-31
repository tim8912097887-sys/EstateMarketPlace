import { NextFunction,Response,Request } from "express"

type Controller = (req: Request,res: Response,next: NextFunction) => Promise<void>

// Catch the error that occur in the controller and pass to error handler 
export const asyncErrorHandler = (controller: Controller) => (async(req: Request,res: Response,next: NextFunction) => {
    try {
        await controller(req,res,next);
    } catch (error) {
        next(error);
    }
})