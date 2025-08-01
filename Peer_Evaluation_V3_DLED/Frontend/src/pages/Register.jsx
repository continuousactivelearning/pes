// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import axios from "axios"; // commented out since we're not connecting yet
// import { showMessage } from "../utils/Message";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("student");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//       });

//       const { token, role: userRole } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", userRole);

//       if (userRole === "admin") navigate("/admin");
//       else if (userRole === "teacher") navigate("/teacher");
//       else if (userRole === "ta") navigate("/ta");
//       else navigate("/student");
//     } catch (err) {
//       showMessage(err.response?.data?.message || "Registration failed");
//       console.error(err);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         minHeight: "100vh",
//         minWidth: "100vw",
//         height: "100vh",
//         width: "100vw",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)",
//         padding: "2rem",
//         boxSizing: "border-box",
//         zIndex: 0,
//       }}
//     >
//       {/* Home icon to route back to homepage */}
//       <Link
//         to="/"
//         style={{
//           position: "absolute",
//           top: 24,
//           left: 24,
//           zIndex: 2,
//           background: "#fff",
//           borderRadius: "50%",
//           boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
//           width: 40,
//           height: 40,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           textDecoration: "none",
//         }}
//         aria-label="Go to homepage"
//       >
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//           <path
//             d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z"
//             stroke="#667eea"
//             strokeWidth="2"
//             strokeLinejoin="round"
//             fill="none"
//           />
//         </svg>
//       </Link>
//       <div
//         style={{
//           background: "#fff",
//           padding: "2.5rem 2rem",
//           borderRadius: "20px",
//           boxShadow: "0 8px 32px rgba(60,60,120,0.12)",
//           minWidth: "320px",
//           maxWidth: "420px",
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           gap: "1.5rem",
//           transition: "box-shadow 0.2s",
//           border: "none",
//           outline: "none",
//         }}
//       >
//         <div
//           style={{
//             width: 70,
//             height: 70,
//             borderRadius: "50%",
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: "0.5rem",
//             boxShadow: "0 2px 12px rgba(102,126,234,0.18)",
//           }}
//         >
//           <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
//             <path
//               fill="#fff"
//               d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
//             />
//           </svg>
//         </div>
//         <h1
//           style={{
//             textAlign: "center",
//             marginBottom: "0.5rem",
//             color: "#3f3d56",
//             fontWeight: 700,
//             letterSpacing: "1px",
//             fontSize: "2rem",
//           }}
//         >
//           Create Account
//         </h1>
//         <p
//           style={{
//             color: "#7a7a9d",
//             textAlign: "center",
//             margin: 0,
//             fontSize: "1rem",
//           }}
//         >
//           Please fill in the details to register
//         </p>
//         <form
//           onSubmit={handleRegister}
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "1.2rem",
//             width: "100%",
//             marginTop: "1rem",
//           }}
//         >
//           {/* Each row is now flex row: label and input/select side by side */}
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <label
//               htmlFor="name"
//               style={{
//                 color: "#3f3d56",
//                 fontWeight: 500,
//                 fontSize: "1rem",
//                 minWidth: 90,
//                 textAlign: "left", // left align label text
//                 width: 90,
//                 display: "block",
//               }}
//             >
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               placeholder="Enter your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               style={{
//                 flex: 1,
//                 padding: "0.75rem 1rem",
//                 borderRadius: "8px",
//                 border: "1px solid #c3cfe2",
//                 fontSize: "1rem",
//                 outline: "none",
//                 transition: "border 0.2s",
//                 background: "#f7f8fa",
//                 boxShadow: "none",
//                 color: "#222", // Ensure input text is black and readable
//               }}
//               required
//             />
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <label
//               htmlFor="email"
//               style={{
//                 color: "#3f3d56",
//                 fontWeight: 500,
//                 fontSize: "1rem",
//                 minWidth: 90,
//                 textAlign: "left", // left align label text
//                 width: 90,
//                 display: "block",
//               }}
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={{
//                 flex: 1,
//                 padding: "0.75rem 1rem",
//                 borderRadius: "8px",
//                 border: "1px solid #c3cfe2",
//                 fontSize: "1rem",
//                 outline: "none",
//                 transition: "border 0.2s",
//                 background: "#f7f8fa",
//                 boxShadow: "none",
//                 color: "#222",
//               }}
//               required
//             />
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <label
//               htmlFor="password"
//               style={{
//                 color: "#3f3d56",
//                 fontWeight: 500,
//                 fontSize: "1rem",
//                 minWidth: 90,
//                 textAlign: "left", // left align label text
//                 width: 90,
//                 display: "block",
//               }}
//             >
//               Password
//             </label>
//             <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={{
//                   width: "100%",
//                   boxSizing: "border-box",
//                   padding: "0.75rem 2.5rem 0.75rem 1rem", // Add space for icon
//                   borderRadius: "8px",
//                   border: "1px solid #c3cfe2",
//                   fontSize: "1rem",
//                   outline: "none",
//                   transition: "border 0.2s",
//                   background: "#f7f8fa",
//                   boxShadow: "none",
//                   color: "#222",
//                 }}
//                 required
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{
//                   position: "absolute",
//                   right: "0.75rem",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   cursor: "pointer",
//                   color: "#888",
//                 }}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <label
//               htmlFor="role"
//               style={{
//                 color: "#3f3d56",
//                 fontWeight: 500,
//                 fontSize: "1rem",
//                 minWidth: 90,
//                 textAlign: "left", // left align label text
//                 width: 90,
//                 display: "block",
//               }}
//             >
//               Role
//             </label>
//             <select
//               id="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               style={{
//                 flex: 1,
//                 padding: "0.75rem 1rem",
//                 borderRadius: "8px",
//                 border: "1px solid #c3cfe2",
//                 fontSize: "1rem",
//                 outline: "none",
//                 background: "#f7f8fa",
//                 boxShadow: "none",
//                 color: "#222", // Ensure select text is black
//               }}
//               required
//             >
//               <option value="student" style={{ color: "#222" }}>
//                 Student
//               </option>
//               <option value="teacher" style={{ color: "#222" }}>
//                 Teacher
//               </option>
//               {/* <option value="ta" style={{ color: '#222' }}>TA</option>
//                             <option value="admin" style={{ color: '#222' }}>Admin</option> */}
//             </select>
//           </div>
//           <button
//             type="submit"
//             style={{
//               padding: "0.75rem 1rem",
//               borderRadius: "8px",
//               border: "none",
//               background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
//               color: "#fff",
//               fontWeight: 600,
//               fontSize: "1.1rem",
//               cursor: "pointer",
//               boxShadow: "0 2px 8px rgba(102,126,234,0.12)",
//               transition: "background 0.2s",
//             }}
//           >
//             Register
//           </button>
//         </form>
//         <div
//           style={{
//             marginTop: "1rem",
//             textAlign: "center",
//             fontSize: "0.95rem",
//           }}
//         >
//           {/* You can add "Already have an account? Login" link here if needed */}
//           <span style={{ color: "#7a7a9d" }}>
//             Already have an account?&nbsp;
//           </span>
//           <Link
//             to="/login"
//             style={{
//               color: "#667eea",
//               textDecoration: "underline",
//               fontWeight: 500,
//             }}
//           >
//             Login here
//           </Link>
//         </div>
//       </div>
//       <style>{`
//                 html, body {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                     background: linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%);
//                     min-height: 100vh;
//                     min-width: 100vw;
//                 }
//                 @media (max-width: 600px) {
//                     padding: 0;
//                     box-sizing: border-box;
//                     overflow: hidden;
//                 }
//                 @media (max-width: 600px) {
//                     div[style*="background: #fff"] {
//                         min-width: 90vw !important;
//                         padding: 1.5rem 0.5rem !important;
//                         border-radius: 12px !important;
//                     }
//                     h1 {
//                         font-size: 1.5rem !important;
//                     }
//                     form > div {
//                         flex-direction: column !important;
//                         align-items: stretch !important;
//                         gap: 0.5rem !important;
//                     }
//                     form label {
//                         min-width: 0 !important;
//                         text-align: left !important;
//                     }
//                 }
//                 @media (min-width: 900px) {
//                     div[style*="background: #fff"] {
//                         min-width: 400px !important;
//                         max-width: 480px !important;
//                         padding: 3rem 2.5rem !important;
//                     }
//                 }
//             `}</style>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerificationModal from '../components/User/VerificationModal';
import '../../styles/User/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailForVerification(formData.email);
        setShowVerificationModal(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (userData) => {
    setShowVerificationModal(false);
    toast.success('Registration completed successfully!');
    
    // Store user data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userData));
    
    // Redirect based on role
    if (userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (userData.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
    setEmailForVerification('');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Sending verification code...' : 'Register'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>

      {showVerificationModal && (
        <VerificationModal
          email={emailForVerification}
          onSuccess={handleVerificationSuccess}
          onClose={handleVerificationClose}
        />
      )}
    </div>
  );
};

export default Register;
