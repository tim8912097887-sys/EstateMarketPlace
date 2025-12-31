import * as z from "zod";

const envSchema = z.object({
    PORT: z.string().length(4,"Port number is four digit"),
    DATABASE_URL: z.string().includes("mongodb","Must contain database name in connection url"),
    NODE_ENV: z.enum(['development', 'test', 'production'],"Enviroment is not exist")
})

// Validate the env
const _env = envSchema.safeParse(process.env);

// Throw error if variables invalid
if(!_env.success) {
    console.error(`Invalid Enviroment Variables: ${z.prettifyError(_env.error)}`)
    throw new Error('Invalid environment variables');
}

export const env = _env.data;


