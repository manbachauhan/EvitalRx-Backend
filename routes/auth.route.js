import express from "express";
import {
  login,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyOtp,
  updateProfile,
  getProfile,
} from "../controllers/auth.controller.js"; 
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();


router.post("/signup", signup);// Signup route
router.post("/verify-email", verifyEmail); // Email verification route
router.post("/login", login); // Login route
router.post("/forgot-password", forgotPassword);// forgot password 
router.post("/verify-otp", verifyOtp); // verify otp for reset password
router.post("/reset-password", resetPassword); // reset password
router.get('/get-profile', authenticate,getProfile)// get profile
router.put('/update-profile', authenticate ,updateProfile) //update profile



export default router;
