import express from "express";
import userRouter from "./users/user.route.js";
import globalErrorHandler from "./utilities/globalErrorHandler.js";
import { AppError } from "./utilities/customError.js";
import cookieParser from "cookie-parser";

const app = express();

// Body Parser
app.use(express.json());
app.use(cookieParser());

// Mount route
app.use("/users",userRouter);

// Test endpoint working
app.get('/',(req,res) => {
      res.json({ Success: true });
})

// Handle unknown route
app.use('/',(req,res,next) => {
    next(new AppError("Not Found",404,`Can't find ${req.originalUrl} on this server!`,true));
})

// Catch all error
app.use(globalErrorHandler);

export default app;