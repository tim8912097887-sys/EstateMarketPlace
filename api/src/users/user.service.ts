import { CreateUserType } from "./createUserSchema.js";
import { LoginUserType } from "./loginUserSchema.js";
import { UserModel } from "./user.model.js"



export const findUser = async(email: string) => {
    const user = await UserModel.findOne({ email }).lean();
    return user;
}

export const findUserById = async(id: string) => {
    const user = await UserModel.findById(id).lean();
    return user;
}

export const userDelete = async(id: string) => {
     const result = await UserModel.deleteOne({ _id: id });
     return result.deletedCount;
}
export const createUser = async(user: CreateUserType) => {
    const newUser = await UserModel.create(user);
    return newUser;
}

export const loginUser = async(user: LoginUserType) => {
    const existUser = await UserModel.findOne({ email: user.email });
    // Null stands for not found or not match
    if(!existUser) return null;
    const isMatch = await existUser.comparePassword(user.password);
    if(!isMatch) return null;
    return existUser;
}