import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true, default: 'student'
  },
  isTA: { type:Boolean, default:false },
  // isEmailVerified: {
  //   type: Boolean,
  //   default: false
  // },
  // emailVerificationCode: {
  //   type: String,
  //   default: null
  // },
  // emailVerificationExpires: {
  //   type: Date,
  //   default: null
  // },
  resetToken: {
    type: String,
    default: null
  },
  tokenExpiry: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
