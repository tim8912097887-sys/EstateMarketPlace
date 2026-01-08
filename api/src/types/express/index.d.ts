type Payload = {
    sub: string
    username: string 
}
// Add user to existing type
declare global {
    namespace Express {
        interface Request {
            user?: Payload
        }
    }
}

export {};