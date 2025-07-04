import { Request, Response } from 'express';
import { User } from '../../models/User.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'pes-secret';
const OTP_STORE = new Map<string, string>();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const sendOtpEmail = async (req: Request, res: Response) : Promise<void> => {
  const { email } = req.body;
  if (!email)
  { 
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  OTP_STORE.set(email, otp);

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_SENDER || "noreplypeerevaluationsystem@gmail.com",      
      pass: process.env.MAIL_PASSWORD ||  "twmnfoksvgwfcegh"   
    }
  });

  // Email options
  const mailOptions = {
    from: `"OTP Verification" <noreplypeerevaluationsystem@gmail.com>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<h3>Your OTP is <span style="color:blue">${otp}</span></h3>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  const savedOtp = OTP_STORE.get(email);

  if (String(otp) === String(savedOtp)) {
    OTP_STORE.delete(email);
    res.status(200).json({ verified: true });
  } else {
    res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', token, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

import { Batch } from '../../models/Batch.ts'; 

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 🔍 Check if the user is a TA in any batch
    const isTA = await Batch.exists({ ta: user._id });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      isTA: Boolean(isTA),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Generate a password reset token (valid for 15 mins)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

    // Reset link
    //const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_SENDER || "noreplypeerevaluationsystem@gmail.com",      
          pass: process.env.MAIL_PASSWORD ||  "twmnfoksvgwfcegh"   
        }
      });

    await transporter.sendMail({
      from: `"Password Reset" <noreplypeerevaluationsystem@gmail.com>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <h3>Hello, ${user.name || 'User'}</h3>
        <p>You requested to reset your password.</p>
        <p><a href="${resetLink}" target="_blank">Click here to reset it</a></p>
        <p>This link is valid for 15 minutes only.</p>
      `,
    });

    res.status(200).json({ message: 'Password reset link sent to email.' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset password controller
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({ message: 'Invalid token or user not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset token error:', err);
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};
