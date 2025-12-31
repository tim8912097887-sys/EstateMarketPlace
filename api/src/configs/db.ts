import mongoose from "mongoose"
import { env } from "./env.js";

export const dbConnection = async() => {
    // Log message when event occur
    mongoose.connection.on("connected",() => console.log(`Database connected`));
    mongoose.connection.on("error",(error) => console.error(`Database connection error: ${error}`));
    mongoose.connection.on("disconnected",() => console.log(`Database disconnected`));
    
    try {
        // Connecting to database
        await mongoose.connect(env.DATABASE_URL,{
            // Limit the max size of pool to prevent slow operation
            maxPoolSize: 10,
            minPoolSize: 5,
            // Fail fast if database down
            serverSelectionTimeoutMS: 15000,
            // Kill the socket if it inactive longer than one minute
            socketTimeoutMS: 60000,
            // Default 6 will slow the connection process
            family: 4,
            // Disable automatic creation of index to improve performance in production
            autoIndex: env.NODE_ENV==='development',
            
        });
    } catch (error) {
        console.error(`Initial database connection error: ${error}`);
        process.exit(1);
    }
}

// Utility function for close database
export const dbDisconnection = async() => {
    await mongoose.connection.close();
}