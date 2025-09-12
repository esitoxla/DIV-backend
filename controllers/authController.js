import User from "../models/auth.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { firstName, lastName, businessName, email, password } = req.body;

  if (!firstName || !lastName || !businessName || !email || !password) {
    const error = new Error("All fields required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      statusCode: 201,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("email and password is required");
    error.statusCode = 400;
    return next(error);
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 401;
      return next(error);
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      const error = new Error("Incorrect email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
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
      "There has been a password reset request , follow the link provided";

    const html = `
    <p> This is the reset link</p>
    <a href="${resetUrl}" target="_blank"> Follow this link</a>
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
  const { resetToken } = req.params;

  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

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
  await user.save();

  res.status(200).json({
    success: true,
    message: "password reset successfully",
  });
};

export const getUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      const error = new Error("token invalid");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};



export const updateUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // ensures validation + return updated doc
    ).select("-password -__v");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const profileUpload = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.profilePicture = `uploads/${req.file.filename}`;
    await user.save();

    // refetch or use lean copy so password doesn’t come back
    const updatedUser = await User.findById(user._id).select("-password -confirmPassword -__v");

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      user: updatedUser, // send clean updated user
    });
  } catch (error) {
    next(error);
  }
};
