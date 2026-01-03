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