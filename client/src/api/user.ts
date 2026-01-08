import { LoginUserSchema, type LoginUserType } from "../schemas/loginUser"
import { SignupUserSchema, type SignupUserType } from "../schemas/signupUser";
import { createRequest } from "../utilities/apiHelper"
import { asyncHandler } from "../utilities/asyncHandler"

export const loginUser = asyncHandler(async(user: LoginUserType) => {
    
      const validUser = LoginUserSchema.safeParse(user);
      if(!validUser.success) return validUser.error.issues[0].message;
      const res = await fetch("/api/users/signin",createRequest("POST",validUser.data));
      const data = await res.json();
        if(data.success) {
            return data.data;
        } else {
            return data.message;
        }
})

export const signupUser = asyncHandler(async(user: SignupUserType) => {

    const validUser = SignupUserSchema.safeParse(user);
    if(!validUser.success) return validUser.error.issues[0].message;

    const res = await fetch("/api/users/signup",createRequest("POST",validUser.data))
    const data = await res.json();
    if(data.success) {
        return data.data;
    } else {
        return data.message;
    }
})

export const googleLogin = asyncHandler(async(user: Omit<SignupUserType,'password'>&{ avatar: string }) => {
     
    const res = await fetch('/api/users/google',createRequest("POST",user));
    const data = await res.json();

    if(data.success) {
        return data.data;
    } else {
        return data.message;
    }
})

export const logoutUser = asyncHandler(async() => {
     
    const res = await fetch('/api/users/logout',createRequest('DELETE'));
    const data = await res.json();
    // Whether fail or success all return string
    return data.message;
})

export const deleteUser = asyncHandler(async(token: string) => {
     
    const res = await fetch('/api/users/me',{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            // Bearer token for authentication
            "authorization": `Bearer ${token}`
        }
    });
    const data = await res.json();
    // Whether fail or success all return string
    return data.message;
})