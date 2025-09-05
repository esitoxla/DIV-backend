import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { Error } from "mongoose";
import { sendMail } from "../config/sendMail.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.create(req.body);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      sameSite: "strict",
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Incorrect email or password");
      error.statusCode = 401;
      return next(error);
    }
    const isSame = await user.compareTwoPasswords(password, user.password);

    if (!isSame) {
      const error = new Error("Incorrect email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      // sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      success: true,
      message: "user logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User with this email does not exist");
      error.statusCode = 400;
      return next(error);
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;

    const subject =
      "There has been a password reset request, follow the link provided";

    const html = `
    <p>This is the reset link</p>
    <a href="${resetUrl}" target="_blank">Follow this link</a>
    `;

    try {
      sendMail({
        to: user.email,
        subject,
        html,
      });

      res.status(200).json({
        success: true,
        message: "Link sent to email successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      user.save({ validateBeforeSave: true });
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetPasswordToken } = req.params;

    const hashed = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("The token or link has expired");
      error.statusCode = 400;
      return next(error);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    //   user.passwordUpdateTime = new Date();
    await user.save();

  

    res.status(200).json({
      success: true,
      message: "password reset successfully",
    });

  } catch (error) {
    next(error);
  }
};

export const test = (req, res, next) => {
  res.send("testing middleware");
};
