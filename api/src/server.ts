import app from "./app.js";
import { dbConnection, dbDisconnection } from "./configs/db.js";
import { env } from "./configs/env.js";


const server = app.listen(env.PORT,async() => {
    console.log(`Server listen on port ${env.PORT}`);
    await dbConnection();
});

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