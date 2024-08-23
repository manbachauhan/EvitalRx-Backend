import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter object with SMTP server details
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD, 
  },
});

// Function to send verification email
export const sendVerificationEmail = async (toEmail, token) => {
  const mailOptions = {
    from: process.env.EMAIL, 
    to: toEmail, 
    subject: "Email Verification", 
    text: `Your verification code is: ${token}`, 
    html: `<h3>Your verification code is: <strong>${token}</strong></h3>`, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Function to send forgot password email
export const sendForgotPasswordEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL, 
    to: toEmail, 
    subject: "Password Reset Request", 
    text: `Your OTP for password reset is: ${otp}`, 
    html: `<h3>Your OTP for password reset is: <strong>${otp}</strong></h3>`, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Forgot password email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw new Error("Failed to send forgot password email");
  }
};

// Function to send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL, 
    to: toEmail, 
    subject: "Password Reset Confirmation", 
    text: "Your password has been successfully reset.", 
    html: `<h3>Your password has been successfully reset.</h3>`, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset confirmation email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    throw new Error("Failed to send password reset confirmation email");
  }
};
