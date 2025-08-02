import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  // Store registration data here instead of creating User
  registrationData: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, // This will be the hashed password
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true,
    }
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete expired documents
  },
}, {
  timestamps: true,
});

export const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);