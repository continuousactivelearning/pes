import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { showMessage } from "../utils/Message";
import VerificationModal from "../components/User/VerificationModal";
import "../styles/User/Register.css";

const PasswordRequirement = ({ met, text }) => (
  <div className={`password-requirement ${met ? "met" : "unmet"}`}>
    {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
    <span>{text}</span>
  </div>
);

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(true);

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password on change
    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      showMessage(
        "Please ensure your password meets all requirements!",
        "info"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/send-verification-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmailForVerification(formData.email);
        setShowVerificationModal(true);
        showMessage(
          data.message || "Verification code sent successfully!",
          "success"
        );
      } else {
        console.error("Failed to send verification code:", data);
        showMessage(
          data.message || "Failed to send verification code",
          "error"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      showMessage(
        "Failed to send verification code. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (userData) => {
    setShowVerificationModal(false);
    showMessage("Registration completed successfully!", "success");

    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);

    if (userData.role === "admin") {
      navigate("/admin");
    } else if (userData.role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
    setEmailForVerification("");
  };

  return (
    <div className="register-container">
      {/* Home icon to route back to homepage */}
      <Link to="/" className="home-icon" aria-label="Go to homepage">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z"
            stroke="#667eea"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </Link>

      <div
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
          minWidth: "320px",
          maxWidth: "420px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          transition: "box-shadow 0.2s",
          border: "none",
          outline: "none",
          margin: "auto",
        }}
      >
        <div className="avatar-icon">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
            />
          </svg>
        </div>

        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">
          Please fill in the details to register
        </p>

        <form onSubmit={handleRegister} className="register-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-group label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-group label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password" className="form-group label">
              Password
            </label>
            <div className="password-container">
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`password-input ${
                    formData.password && !isPasswordValid ? "invalid" : ""
                  }`}
                  required
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
              {formData.password && (
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
          </div>

          {/* Role Field */}
          <div className="form-group">
            <label htmlFor="role" className="form-group label">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="student" style={{ color: "#222" }}>
                Student
              </option>
              <option value="teacher" style={{ color: "#222" }}>
                Teacher
              </option>
              {/* <option value="admin" style={{ color: "#222" }}>
                Admin
              </option> */}
            </select>
          </div>

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? "Sending Verification Code..." : "Register"}
          </button>
        </form>

        <div className="login-link">
          <span className="login-link-text">
            Already have an account?&nbsp;
          </span>
          <Link to="/login" className="login-link a">
            Login here
          </Link>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <VerificationModal
          email={emailForVerification}
          handleVerificationSuccess={handleVerificationSuccess}
          handleVerificationClose={handleVerificationClose}
        />
      )}
    </div>
  );
}
