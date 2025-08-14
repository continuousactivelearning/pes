import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaHome,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import "../styles/User/ResetPassword.css";
import { showMessage } from "../utils/Message";

const PasswordRequirement = ({ met, text }) => (
  <div className={`password-requirement ${met ? "met" : "unmet"}`}>
    {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
    <span>{text}</span>
  </div>
);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const validatePassword = (password) => {
    if (!password) {
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      setIsPasswordValid(true);
      return false;
    }

    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordValidation(validation);
    const isValid = Object.values(validation).every(Boolean);
    setIsPasswordValid(isValid);
    return isValid;
  };

  const checkPasswordsMatch = (newPass, confirmPass) => {
    const match = newPass === confirmPass;
    setPasswordsMatch(match);
    return match;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    if (confirmPassword) {
      checkPasswordsMatch(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    checkPasswordsMatch(password, value);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!validatePassword(password)) {
      setError("Please ensure your password meets all requirements");
      setLoading(false);
      return;
    }

    if (!checkPasswordsMatch(password, confirmPassword)) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      showMessage(res.data.message, "success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Invalid or expired token!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <Link to="/" className="home-icon" aria-label="Go to homepage">
        <FaHome size={22} color="#667eea" />
      </Link>

      <div
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
          minWidth: "320px",
          maxWidth: "420px",
          maxHeight: "90%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0rem",
        }}
      >
        <div className="avatar-icon">
          <FaLock size={32} color="#fff" />
        </div>

        <h1 className="reset-password-title">Reset Password</h1>

        <form onSubmit={handleReset} className="reset-password-form">
          {/* New Password */}
          <div className="form-group">
            <label
              style={{ textAlign: "center", width: "100%" }}
              htmlFor="password"
            >
              New Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`form-input ${
                  password && !isPasswordValid ? "invalid" : ""
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="password-requirements">
                <div className="password-requirements-title">
                  Password Requirements:
                </div>
                <div className="password-requirements-list">
                  <PasswordRequirement
                    met={passwordValidation.length}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordValidation.uppercase}
                    text="One uppercase letter (A-Z)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.lowercase}
                    text="One lowercase letter (a-z)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.number}
                    text="One number (0-9)"
                  />
                  <PasswordRequirement
                    met={passwordValidation.special}
                    text="One special character (!@#$%^&*)"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label
              style={{ textAlign: "center", width: "100%" }}
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className={`form-input ${
                  confirmPassword && !passwordsMatch ? "invalid" : ""
                }`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div
                className={`password-match-indicator ${
                  passwordsMatch ? "match" : "no-match"
                }`}
              >
                {passwordsMatch ? <FaCheck size={12} /> : <FaTimes size={12} />}
                <span>
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`reset-password-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
