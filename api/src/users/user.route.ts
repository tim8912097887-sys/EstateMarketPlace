import express from "express";
import { deleteUser, googleLogin, logoutUser, refreshUser, signinUser, signupUser } from "./user.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { CreateUserSchema } from "./createUserSchema.js";
import { LoginUserSchema } from "./loginUserSchema.js";
import { preventRecurrentLogin } from "../middlewares/preventRecurrentLogin.js";
import { GoogleUserSchema } from "./googleUserSchema.js";
import { authCheck } from "../middlewares/authCheck.js";

const router = express.Router();

router.post('/signup',validateRequest(CreateUserSchema),signupUser);
router.post('/google',validateRequest(GoogleUserSchema),googleLogin);
router.post('/signin',preventRecurrentLogin,validateRequest(LoginUserSchema),signinUser);
router.delete('/logout',logoutUser);
router.delete('/me',authCheck,deleteUser);
// Refresh access token
router.get('/refresh',refreshUser);

export default router;