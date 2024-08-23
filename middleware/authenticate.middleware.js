import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 
  // Token from cookie or Authorization header

 
 console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token structure" });
    }

    const user = await User.findById(decoded.id); // Find user by ID from token

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
