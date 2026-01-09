import { Types } from "mongoose";
import { CreateUserType } from "./createUserSchema.js";
import { LoginUserType } from "./loginUserSchema.js";
import { UserModel } from "./user.model.js"

type SecureUser = {
    email: string
    username: string
    avatar: string
    _id: Types.ObjectId
}

export const findUser = async(email: string) => {
    const user = await UserModel.findOne({ email }).lean() as SecureUser;
    return user;
}

export const findUserById = async(id: string) => {
    const user = await UserModel.findById(id);
    return user;
}

export const userDelete = async(id: string) => {
     const result = await UserModel.deleteOne({ _id: id });
     return result.deletedCount;
}
export const createUser = async(user: CreateUserType) => {
    const newUser = await UserModel.create(user);
    const { password,...wtihOutPassword } = newUser.toObject();
    return wtihOutPassword;
}

export const loginUser = async(user: LoginUserType) => {
    // Manually select password
    const existUser = await UserModel.findOne({ email: user.email },"+password");
    // Null stands for not found or not match
    if(!existUser) return null;
    const isMatch = await existUser.comparePassword(user.password);
    if(!isMatch) return null;
    const { password,...withoutPassword } = existUser.toObject();
    return withoutPassword;
}