import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';
import sendEmail from '../utils/sendEmail.js';
import { Course } from '../models/Course.js';
import emailValidator from 'email-validator';
import { Batch } from '../models/Batch.js';

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30d'
  });
};

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailIsValid = emailValidator.validate(email);
    if (!emailIsValid) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate role
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 4-digit verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing verification codes for this email
    await VerificationCode.deleteMany({ email });

    // Store verification code with registration data (NO USER CREATED YET)
    await VerificationCode.create({
      email,
      code: verificationCode,
      registrationData: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      expiresAt,
    });

    // Send verification email with enhanced styling
    const verificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4b3c70; margin: 0; font-size: 28px;">Email Verification</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Peer Evaluation System</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Hi ${name},</h2>
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
              Thank you for registering with the Peer Evaluation System. To complete your registration, please verify your email address using the verification code below:
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #4b3c70; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
              ${verificationCode}
            </div>
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Important:</strong> This verification code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              Best regards,<br/>
              <strong>PES Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(email, 'Email Verification Code - Peer Evaluation System', verificationHtml);

    console.log(`Verification code sent to ${email}: ${verificationCode}`);

    res.status(200).json({
      message: 'Verification code sent to your email. Please check your inbox.',
      email: email,
      requiresVerification: true
    });

  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({
      message: 'Failed to send verification code',
      error: error.message
    });
  }
};

// Verify email and CREATE USER (only when verification is successful)
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Validate input
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    // Find verification code with registration data
    const verificationRecord = await VerificationCode.findOne({ 
      email, 
      code 
    });

    if (!verificationRecord) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code has expired
    if (verificationRecord.expiresAt < new Date()) {
      // Clean up expired records
      await VerificationCode.deleteMany({ email });
      
      return res.status(400).json({ 
        message: 'Verification code has expired. Please start registration again.',
        redirectToRegister: true 
      });
    }

    // NOW CREATE THE USER (only after successful verification)
    const { registrationData } = verificationRecord;
    
    // Double-check user doesn't exist (race condition protection)
    const existingUser = await User.findOne({ email: registrationData.email });
    if (existingUser) {
      await VerificationCode.deleteOne({ _id: verificationRecord._id });
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create the user
    const user = await User.create({
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password, // Already hashed
      role: registrationData.role,
      isVerified: true, // Mark as verified since they completed email verification
    });

    // Clean up verification code
    await VerificationCode.deleteOne({ _id: verificationRecord._id });

    // Generate JWT token with user ID and role
    const token = generateToken(user._id, user.role);

    // Send welcome email
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4b3c70; margin: 0; font-size: 28px;">🎉 Welcome to PES!</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Peer Evaluation System</p>
          </div>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #155724; margin: 0 0 15px 0; font-size: 20px;">Registration Successful! ✅</h2>
            <p style="color: #155724; margin: 0;">Your email has been verified and your account has been created successfully.</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Account Details:</h3>
            <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Name:</strong> ${user.name}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #555; line-height: 1.6; margin: 0;">
              You can now log in to the Peer Evaluation System and start exploring the features available to you.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              Welcome aboard!<br/>
              <strong>PES Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail(user.email, 'Welcome to Peer Evaluation System! 🎉', welcomeHtml);
    } catch (emailError) {
      console.log('Welcome email failed to send:', emailError.message);
      // Don't fail the registration if welcome email fails
    }

    console.log(`User ${email} created and verified successfully`);

    res.status(201).json({
      message: 'Email verified successfully! Registration completed.',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      message: 'Email verification failed',
      error: error.message
    });
  }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email. Please login instead.',
        redirectToLogin: true 
      });
    }

    // Find existing verification record
    const existingVerification = await VerificationCode.findOne({ email });
    if (!existingVerification) {
      return res.status(400).json({ 
        message: 'No pending registration found for this email. Please start registration again.',
        redirectToRegister: true 
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update the existing verification record
    existingVerification.code = verificationCode;
    existingVerification.expiresAt = expiresAt;
    await existingVerification.save();

    // Send verification email
    const { registrationData } = existingVerification;
    const verificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4b3c70; margin: 0; font-size: 28px;">New Verification Code</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Peer Evaluation System</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Hi ${registrationData.name},</h2>
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
              Here's your new verification code to complete your registration:
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #4b3c70; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
              ${verificationCode}
            </div>
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Important:</strong> This verification code will expire in 10 minutes.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              Best regards,<br/>
              <strong>PES Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(email, 'New Verification Code - Peer Evaluation System', verificationHtml);

    console.log(`New verification code sent to ${email}: ${verificationCode}`);

    res.status(200).json({
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Error resending verification code:', error);
    res.status(500).json({
      message: 'Failed to resend verification code',
      error: error.message
    });
  }
};

// Direct registration (backup method)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Verify email existence
    const emailIsValid = emailValidator.validate(email);
    if (!emailIsValid) {
      return res.status(400).json({ message: 'Email address does not exist or is invalid.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true, // Direct registration is auto-verified
    });

    // Send welcome email
    const welcomeHtml = `
      <div style="font-family:Arial,sans-serif; padding:20px;">
        <h2>Welcome to the Peer Evaluation System</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for registering on the <strong>Peer Evaluation System</strong>.</p>
        <p>Your account has been successfully created with the following details:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Role:</strong> ${user.role}</li>
        </ul>
        <p>We're excited to have you onboard!</p>
        <br/>
        <p>Best regards,<br/>PES Team</p>
      </div>
    `;

    await sendEmail(user.email, 'Welcome to Peer Evaluation System', welcomeHtml);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected Profile
export const getProfile = async (req, res) => {
  if (!req.user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    isTA: req.user.isTA
  });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // const resetLink = `http://localhost:3000/reset-password/${token}`;
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000';
    const resetLink = `${CLIENT_URL}/reset-password/${token}`;
    const html = `
      <div style="font-family:Arial,sans-serif; padding:20px;">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name || ''},</p>
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" style="background:#667eea;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // console.log("EMAIL_USER:", process.env.EMAIL_USER);
    // console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? 'Loaded' : 'Missing');


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset for Peer Evaluation System',
      html
    });

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

