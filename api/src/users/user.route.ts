import express from "express";
import { deleteUser, googleLogin, logoutUser, refreshUser, signinUser, signupUser, updateUser } from "./user.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { CreateUserSchema } from "./createUserSchema.js";
import { LoginUserSchema } from "./loginUserSchema.js";
import { preventRecurrentLogin } from "../middlewares/preventRecurrentLogin.js";
import { GoogleUserSchema } from "./googleUserSchema.js";
import { authCheck } from "../middlewares/authCheck.js";
import { UpdateUserSchema } from "./updateUserSchema.js";

const router = express.Router();

router.post('/signup',validateRequest(CreateUserSchema),signupUser);
router.post('/google',validateRequest(GoogleUserSchema),googleLogin);
router.post('/signin',preventRecurrentLogin,validateRequest(LoginUserSchema),signinUser);
router.delete('/logout',logoutUser);
router.delete('/me',authCheck,deleteUser);
router.put('/me',authCheck,validateRequest(UpdateUserSchema),updateUser);
// Refresh access token
router.get('/refresh',refreshUser);

export default router;