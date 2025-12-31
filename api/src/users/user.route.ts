import express from "express";
import { logoutUser, refreshUser, signinUser, signupUser } from "./user.controller.js";

const router = express.Router();

router.post('/signup',signupUser);
router.post('/signin',signinUser);
router.delete('/logout',logoutUser);
// Refresh access token
router.get('/refresh',refreshUser);

export default router;