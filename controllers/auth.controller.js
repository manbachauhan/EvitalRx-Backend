// API controller
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import moment from "moment";
import { generateVerificationToken } from "../util/generateVerificationToken.js";
import { generateTokenAndSetCookies } from "../util/generateTokenAndSetCookies.js";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetConfirmationEmail,
} from "../util/mailService.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { name, phone, dob, gender, address, email, password } = req.body;

  try {
    // validation
    if (!name || !phone || !dob || !gender || !address || !email || !password) {
      throw new Error("All fields are required");
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Invalid phone number");
    }
    const dobDate = moment(dob, "DD-MM-YYYY"); // Expecting date in 'YYYY-MM-DD' format
    // Check if dob is valid and not in the future
    if (!dobDate.isValid() || dobDate.isAfter(moment())) {
      throw new Error("Invalid Date of Birth. Please provide a valid date.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }

    // Check if the user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10); // Hash password

    // Generate verification token (OTP)
    const verificationToken = generateVerificationToken(); // this is a function generating a token

    // Create new user
    const user = new User({
      name,
      phone,
      dob: dobDate.toDate(), // Convert moment object to JavaScript Date
      gender,
      address,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpireAt: Date.now() + 60 * 60 * 1000, // 24 hours from now
    });

    await user.save();
    console.log("user", user);

    // Send verification email with OTP
    console.log(verificationToken);
    await sendVerificationEmail(email, verificationToken);

    const token = generateTokenAndSetCookies(res, user._id);
    // Authenticate client by generating a token and setting a cookie

    // Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully. A verification email has been sent.",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//verify-email API

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  console.log("token", token);
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpireAt: { $gt: Date.now() }, // Check if the token is still valid
    });
    console.log(token);
    console.log("userrr", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Update user to set isVerified to true and clear verification token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// login API
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    console.log("c");
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    console.log("user", user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }

    const token = generateTokenAndSetCookies(res, user._id); // Generate a token

    res.status(200).json({
      success: true,
      message:"Login Successfully ",
      token,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: ` Login failed 
      ${error.message}` });
  }
};

// forgot password  API

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    user.resetPasswordToken = otp;
    user.resetPasswordExpireAt = Date.now() + 3600000; // 1 hour from now

    await user.save();

    await sendForgotPasswordEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// verify otp  API

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    if (!otp) {
      throw new Error("OTP is required");
    }

    const user = await User.findOne({
      resetPasswordToken: otp,
      resetPasswordExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is valid
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      userId: user._id,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Reset password  API

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      throw new Error("password is required");
    }

    // Find user by email
    const user = await User.findOne({
      // email: email,
      resetPasswordToken: { $exists: true }, // Ensure there is a reset token
      resetPasswordExpireAt: { $gt: Date.now() }, // Ensure token has not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or expired reset token",
      });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;

    await user.save();

    await sendPasswordResetConfirmationEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//get profile API

export const getProfile = async (req, res) => {
  try {
    // Extract user ID or email from req.user
    const { email } = req.user;
  
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "User email not found in request" });
    }

    // Find user by email
   
    const user = await User.findOne({ email }).select("-password"); // Exclude password field
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  const token = generateTokenAndSetCookies(res, user._id);
    res.status(200).json({ success: true, user ,token });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// update profile API

export const updateProfile = async (req, res) => {
  const {
    name,
    phone,
    dob,
    gender,
    address,
    email,
    currentPassword,
    newPassword,
  } = req.body;
  const { _id: userId } = req.user; // Extract user ID from the authenticated user

  try {
    if (!name || !phone || !dob || !gender || !address) {
      throw new Error("All fields are required");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect current password" });
      }

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
    }

    user.name = name;
    user.phone = phone;
    user.dob = new Date(dob);
    user.gender = gender;
    user.address = address;
    // user.email = email;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
