import jwt from "jsonwebtoken";
import User from "../models/auth.js";

export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // console.log("Cookies received:", req.cookies);
    // console.log("Token:", req.cookies.jwt);

    if (!token) {
      return res.status(401).json({ message: "User not logged in!" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token not valid!" });
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoutes error:", error.message);
    res.status(500).json({ message: "Server error in protectRoutes" });
  }
};
