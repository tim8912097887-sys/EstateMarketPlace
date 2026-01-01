import express from "express";
import { logoutUser, refreshUser, signinUser, signupUser } from "./user.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { CreateUserSchema } from "./createUserSchema.js";
import { LoginUserSchema } from "./loginUserSchema.js";
import { preventRecurrentLogin } from "../middlewares/preventRecurrentLogin.js";

const router = express.Router();

router.post('/signup',validateRequest(CreateUserSchema),signupUser);

router.post('/signin',preventRecurrentLogin,validateRequest(LoginUserSchema),signinUser);
router.delete('/logout',logoutUser);
// Refresh access token
router.get('/refresh',refreshUser);

export default router;