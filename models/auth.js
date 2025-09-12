import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return value.includes("@");
        },
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    confirmPassword: {
      type: String,
      required: true,
      minLength: 5,
    },
    profilePicture: { type: String }, // Cloudinary or image URL
    about: { type: String }, // "About me" section
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      google: { type: String },
    },
    plan: {
      type: String,
      enum: ["free", "pro_monthly", "pro_yearly"],
      default: "free",
    },
    resetPasswordToken: String,

    resetPasswordTokenExpire: Date,
  },
  { timestamps: true }
);

//runs just before any record coming in is saved
userSchema.pre("save", async function (next) {
  //so long as we are not modifying password, it should skip the hashing (below)
  if (!this.isModified("password")) return next();

  //hash password before saving
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (passwordFromUser) {
  return bcrypt.compare(passwordFromUser, this.password);
};



userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(16).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpire = Date.now() + 24 * 60 * 1000;

  return resetToken;
};






const User = model("user", userSchema);

export default User;

//allows you to add some changes before and after you save

//cookie parser allows us pass a cookie along with a request

//allows us to grab a cookie that came along with a request.
