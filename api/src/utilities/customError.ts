
export class AppError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
    public readonly isOperational: boolean;

    constructor(name: string,httpCode: number,description: string,isOperational: boolean) {
       // Set the error msg
       super(description);  
       // Fix the prototype chain inheritance 
       Object.setPrototypeOf(this, new.target.prototype);
       this.name = name;
       this.httpCode = httpCode;
       this.isOperational = isOperational;
       // Clean up the trail of error  
       Error.captureStackTrace(this);
    }
}