import express from "express";
import userRouter from "./users/user.route.js";
import { dbConnection, dbDisconnection } from "./configs/db.js";
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

const server = app.listen(3000,async() => {
    console.log(`Server listen on port 3000`);
    await dbConnection();
});

// Handle unknown route
app.use('/',(req,res,next) => {
    next(new AppError("Not Found",404,`Can't find ${req.originalUrl} on this server!`,true));
})

// Catch all error
app.use(globalErrorHandler);

// Shutdown function
const gracefulShutdown = (signal: string) => {
      // Log the shutdown message
      console.log(`${signal} recieved: Perform clean up and shutdown`)
      // Close the server
      server.close(async() => {
          try {
            // Close the database
            await dbDisconnection();
            process.exit(0);
          } catch (error) {
            console.error(`Error during shutdown: ${error}`);
            process.exit(1);
          }
      })
      // Force to shutdown if it take too long(e.g. Over 10 sec) 
      const timeout = setTimeout(() => {
         console.error("Could not close the connection in time,forcefully shutting down");
         process.exit(1);
      },10000)
      // Clear the timeout if cleanup is completed
      clearTimeout(timeout);
      console.log('Shutdown completed');
      process.exit(0);
}

// Listen for termination signals
process.on('SIGINT',() => gracefulShutdown("SIGINT"));
process.on('SIGTERM',() => gracefulShutdown("SIGTERM"));