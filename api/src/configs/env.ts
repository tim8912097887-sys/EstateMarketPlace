import * as z from "zod";

console.log(`Current Enviroment: ${process.env.NODE_ENV}`)

const envSchema = z.object({
    PORT: z.string().length(4,"Port number is four digit"),
    DEV_DATABASE_URL: z.string().includes("mongodb","Must contain database name in connection url"),
    TEST_DATABASE_URL: z.string().includes("mongodb","Must contain database name in connection url"),
    NODE_ENV: z.enum(['development', 'test', 'production'],"Enviroment is not exist"),
    ACCESS_TOKEN_SECRET: z.string("Secret must be string").length(32,"Secret has 32 length"),
    REFRESH_TOKEN_SECRET: z.string("Secret must be string").length(32,"Secret has 32 length"),
    ACCESS_TOKEN_EXPIRATION: z.string("Token expiration time is string"),
    REFRESH_TOKEN_EXPIRATION: z.string("Token expiration time is string"),
    COOKIE_REFRESH_EXPIRATION: z.string("Cookie expiration time is string"),
    TEST_SALT: z.string(),
    DEV_SALT: z.string(),
    WHITELIST: z.string()
})

// Validate the env
const _env = envSchema.safeParse(process.env);

// Throw error if variables invalid
if(!_env.success) {
    console.error(`Invalid Enviroment Variables: ${z.prettifyError(_env.error)}`)
    throw new Error('Invalid environment variables');
}

export const env = _env.data;


