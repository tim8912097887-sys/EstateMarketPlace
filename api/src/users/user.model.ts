import { compare, genSalt, hash } from "bcryptjs";
import mongoose from "mongoose";
import { AppError } from "../utilities/customError.js";
import { env } from "../configs/env.js";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [2,"Username at least two characters"],
        maxLength: [50,"Username at most fifty characters"],
        required: [true,"Username is required"],
        unique: [true,"Username already been used"]
    },
    email: {
        type: String,
        maxLength: [50,"Email at most fifty characters"],
        required: [true,"Email is required"],
        // Create index enhance query performance
        unique: [true,"Email already been used"],
        // Turn to lowercase prevent duplicate store
        lowercase: true,
        // Remove accidentally added space
        trim: true,
        // Custom valdator for password
        validate: {
            validator: (email: string) => {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
            },
            message: "Invalid email"
        }
    },
    password: {
        type: String,
        minLength: [6,"Password at least six characters"],
        required: [true,"Password is required"],
        // Custom valdator for password
        validate: {
            validator: (password: string) => {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)
            },
            message: "Password required one lowercase,uppercase alpha,number and special character"
        }
    },
    avatar: {
        type: String,
        required: [true,"Image is required"],
        // Remove accidentally added space
        trim: true,
        validate: {
            validator: (profile: string) => {
                 // Check if it's come from trusted host(like Google)
                const isTrustedHost = profile.includes("googleusercontent.com");
                const hasExtension = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].some(ext => profile.split("?")[0].toLowerCase().endsWith(`${ext}`));
                return isTrustedHost || hasExtension;
            },
            message: (prop) => `${prop.value} is not a valid image URL` 
        },
        // Provide default for those who don't care
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
},{
    timestamps: true,
    // Instance method for password comparison
    methods: {
        async comparePassword(checkPassword: string) {
              const result = await compare(checkPassword,this.password);
              return result;
        }
    }
})

// Hash the new or modified password before persist to database
userSchema.pre("save",async function() {
    if(!this.isModified("password")) return;

    try {
       const salt = await genSalt(env.NODE_ENV==="test"?Number(env.TEST_SALT):Number(env.DEV_SALT));
       const hashedPassword = await hash(this.password,salt);
       this.password = hashedPassword;
       return;
    } catch (error: any) {
       throw error;
    }
})

// Global error handler for the schema
userSchema.post('save', function(error: any, doc: any, next: any) {
  // Only handle duplicate key error
  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const customError = new AppError("Duplicate key",409,`${field} already exists`,true);
    throw customError;
  } else {
    // Rethrow error 
    throw error;
  }
});


// Automatic formatting for all API responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Cast to any allow property deletion
    const obj = ret as any;
    delete obj.password;
    delete obj.__v;
    return obj;
  }
});

export const UserModel = mongoose.model("users",userSchema);