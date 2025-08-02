import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showMessage } from "../utils/Message";
import VerificationModal from "../components/User/VerificationModal";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Send verification response:', data);

      if (response.ok) {
        setEmailForVerification(formData.email);
        setShowVerificationModal(true);
        showMessage(data.message || 'Verification code sent successfully!', 'success');
      } else {
        console.error('Failed to send verification code:', data);
        showMessage(data.message || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('Failed to send verification code. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (userData) => {
    console.log('Verification successful:', userData);
    setShowVerificationModal(false);
    showMessage('Registration completed successfully!', 'success');
    
    // Store user data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    
    // Redirect based on role
    if (userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (userData.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (userData.role === 'ta') {
      navigate('/ta/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleVerificationClose = () => {
    console.log('Verification modal closed');
    setShowVerificationModal(false);
    setEmailForVerification('');
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        minWidth: "100vw",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)",
        padding: "2rem",
        boxSizing: "border-box",
        zIndex: 0,
      }}
    >
      {/* Home icon to route back to homepage */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 2,
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        }}
        aria-label="Go to homepage"
      >
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
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.5rem",
            boxShadow: "0 2px 12px rgba(102,126,234,0.18)",
          }}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
            />
          </svg>
        </div>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "#3f3d56",
            fontWeight: 700,
            letterSpacing: "1px",
            fontSize: "2rem",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "#7a7a9d",
            textAlign: "center",
            margin: 0,
            fontSize: "1rem",
          }}
        >
          Please fill in the details to register
        </p>

        <form
          onSubmit={handleRegister}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          {/* Name Field */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              htmlFor="name"
              style={{
                color: "#3f3d56",
                fontWeight: 500,
                fontSize: "1rem",
                minWidth: 90,
                textAlign: "left",
                width: 90,
                display: "block",
              }}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #c3cfe2",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.2s",
                background: "#f7f8fa",
                boxShadow: "none",
                color: "#222",
              }}
              required
            />
          </div>

          {/* Email Field */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              htmlFor="email"
              style={{
                color: "#3f3d56",
                fontWeight: 500,
                fontSize: "1rem",
                minWidth: 90,
                textAlign: "left",
                width: 90,
                display: "block",
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #c3cfe2",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.2s",
                background: "#f7f8fa",
                boxShadow: "none",
                color: "#222",
              }}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              htmlFor="password"
              style={{
                color: "#3f3d56",
                fontWeight: 500,
                fontSize: "1rem",
                minWidth: 90,
                textAlign: "left",
                width: 90,
                display: "block",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #c3cfe2",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border 0.2s",
                  background: "#f7f8fa",
                  boxShadow: "none",
                  color: "#222",
                }}
                minLength="6"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#888",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Role Field */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label
              htmlFor="role"
              style={{
                color: "#3f3d56",
                fontWeight: 500,
                fontSize: "1rem",
                minWidth: 90,
                textAlign: "left",
                width: 90,
                display: "block",
              }}
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #c3cfe2",
                fontSize: "1rem",
                outline: "none",
                background: "#f7f8fa",
                boxShadow: "none",
                color: "#222",
              }}
              required
            >
              <option value="student" style={{ color: "#222" }}>
                Student
              </option>
              <option value="teacher" style={{ color: "#222" }}>
                Teacher
              </option>
              <option value="admin" style={{ color: "#222" }}>
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: loading 
                ? "#ccc" 
                : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(102,126,234,0.12)",
              transition: "background 0.2s",
            }}
          >
            {loading ? 'Sending verification code...' : 'Register'}
          </button>
        </form>

        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          <span style={{ color: "#7a7a9d" }}>
            Already have an account?&nbsp;
          </span>
          <Link
            to="/login"
            style={{
              color: "#667eea",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Login here
          </Link>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <VerificationModal
          email={emailForVerification}
          onSuccess={handleVerificationSuccess}
          onClose={handleVerificationClose}
        />
      )}

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%);
          min-height: 100vh;
          min-width: 100vw;
        }
        @media (max-width: 600px) {
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        @media (max-width: 600px) {
          div[style*="background: #fff"] {
            min-width: 90vw !important;
            padding: 1.5rem 0.5rem !important;
            border-radius: 12px !important;
          }
          h1 {
            font-size: 1.5rem !important;
          }
          form > div {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.5rem !important;
          }
          form label {
            min-width: 0 !important;
            text-align: left !important;
          }
        }
        @media (min-width: 900px) {
          div[style*="background: #fff"] {
            min-width: 400px !important;
            max-width: 480px !important;
            padding: 3rem 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}