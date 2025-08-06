// import { useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
// import axios from 'axios';

// const PasswordRequirement = ({ met, text }) => (
//   <div style={{ 
//     display: "flex", 
//     alignItems: "center", 
//     gap: "0.5rem",
//     fontSize: "0.75rem",
//     color: met ? "#22c55e" : "#ef4444"
//   }}>
//     {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
//     <span>{text}</span>
//   </div>
// );

// export default function ResetPassword() {
//     const { token } = useParams();
//     const navigate = useNavigate();
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const [passwordValidation, setPasswordValidation] = useState({
//         length: false,
//         uppercase: false,
//         lowercase: false,
//         number: false,
//         special: false
//     });
//     const [isPasswordValid, setIsPasswordValid] = useState(true);
//     const [passwordsMatch, setPasswordsMatch] = useState(true);

//     const validatePassword = (password) => {
//         if (!password) {
//             setPasswordValidation({
//                 length: false,
//                 uppercase: false,
//                 lowercase: false,
//                 number: false,
//                 special: false
//             });
//             setIsPasswordValid(true);
//             return false;
//         }

//         const validation = {
//             length: password.length >= 8,
//             uppercase: /[A-Z]/.test(password),
//             lowercase: /[a-z]/.test(password),
//             number: /\d/.test(password),
//             special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
//         };
        
//         setPasswordValidation(validation);
//         const isValid = Object.values(validation).every(Boolean);
//         setIsPasswordValid(isValid);
//         return isValid;
//     };

//     // Check if passwords match
//     const checkPasswordsMatch = (newPass, confirmPass) => {
//         const match = newPass === confirmPass;
//         setPasswordsMatch(match);
//         return match;
//     };

//     const handlePasswordChange = (e) => {
//         const value = e.target.value;
//         setPassword(value);
//         validatePassword(value);
//         if (confirmPassword) {
//             checkPasswordsMatch(value, confirmPassword);
//         }
//     };

//     const handleConfirmPasswordChange = (e) => {
//         const value = e.target.value;
//         setConfirmPassword(value);
//         checkPasswordsMatch(password, value);
//     };

//     const handleReset = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         if (!validatePassword(password)) {
//             setError('Please ensure your password meets all requirements');
//             return;
//         }

//         if (!checkPasswordsMatch(password, confirmPassword)) {
//             setError('Passwords do not match');
//             return;
//         }

//         try {
//             const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
//             setMessage(res.data.message);
//             setTimeout(() => navigate('/login'), 3000);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Invalid or expired token');
//         }
//     };

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             height: '100vh',
//             width: '100vw',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: 'linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)',
//             padding: '2rem',
//             boxSizing: 'border-box',
//         }}>
//             <Link to="/" style={{
//                 position: 'absolute',
//                 top: 24,
//                 left: 24,
//                 background: '#fff',
//                 borderRadius: '50%',
//                 boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
//                 width: 40,
//                 height: 40,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 textDecoration: 'none'
//             }} aria-label="Go to homepage">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//                     <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#667eea" strokeWidth="2" strokeLinejoin="round" fill="none"/>
//                 </svg>
//             </Link>

//             <div style={{
//                 background: '#fff',
//                 padding: '2.5rem 2rem',
//                 borderRadius: '20px',
//                 boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
//                 minWidth: '320px',
//                 maxWidth: '420px',
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 gap: '1.5rem',
//             }}>
//                 <div style={{
//                     width: 70,
//                     height: 70,
//                     borderRadius: '50%',
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     marginBottom: '0.5rem',
//                     boxShadow: '0 2px 12px rgba(102,126,234,0.18)'
//                 }}>
//                     <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
//                         <path d="M12 2a7 7 0 0 1 7 7v2h1a2 2 0 0 1 2 2v9H2v-9a2 2 0 0 1 2-2h1V9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v2h10V9a5 5 0 0 0-5-5Z"/>
//                     </svg>
//                 </div>

//                 <h1 style={{
//                     textAlign: 'center',
//                     color: '#3f3d56',
//                     fontWeight: 700,
//                     fontSize: '2rem',
//                     marginBottom: '0.5rem'
//                 }}>Reset Password</h1>

//                 <form onSubmit={handleReset} style={{
//                     width: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '1.2rem',
//                     marginTop: '1rem'
//                 }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                         <label htmlFor="password" style={{
//                             color: '#3f3d56',
//                             fontWeight: 500,
//                             fontSize: '1rem',
//                         }}>New Password</label>
//                         <div style={{ position: 'relative' }}>
//                             <input
//                                 id="password"
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Enter New Password"
//                                 value={password}
//                                 onChange={handlePasswordChange}
//                                 required
//                                 style={{
//                                     width: '100%',
//                                     boxSizing: 'border-box',
//                                     padding: '0.75rem 2.5rem 0.75rem 1rem',
//                                     borderRadius: '8px',
//                                     border: `1px solid ${password && !isPasswordValid ? '#ef4444' : '#c3cfe2'}`,
//                                     background: '#f7f8fa',
//                                     fontSize: '1rem',
//                                     outline: 'none',
//                                     color: '#222'
//                                 }}
//                             />
//                             <span
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 style={{
//                                     position: 'absolute',
//                                     right: '0.75rem',
//                                     top: '50%',
//                                     transform: 'translateY(-50%)',
//                                     cursor: 'pointer',
//                                     color: '#888',
//                                 }}
//                             >
//                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>

//                         {/* Password Requirements */}
//                         {password && (
//                             <div style={{
//                                 marginTop: '0.5rem',
//                                 padding: '0.75rem',
//                                 background: '#f8f9fa',
//                                 borderRadius: '6px',
//                                 border: '1px solid #e9ecef'
//                             }}>
//                                 <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: '#495057' }}>
//                                     Password Requirements:
//                                 </div>
//                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
//                                     <PasswordRequirement 
//                                         met={passwordValidation.length} 
//                                         text="At least 8 characters" 
//                                     />
//                                     <PasswordRequirement 
//                                         met={passwordValidation.uppercase} 
//                                         text="One uppercase letter (A-Z)" 
//                                     />
//                                     <PasswordRequirement 
//                                         met={passwordValidation.lowercase} 
//                                         text="One lowercase letter (a-z)" 
//                                     />
//                                     <PasswordRequirement 
//                                         met={passwordValidation.number} 
//                                         text="One number (0-9)" 
//                                     />
//                                     <PasswordRequirement 
//                                         met={passwordValidation.special} 
//                                         text="One special character (!@#$%^&*)" 
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                         <label htmlFor="confirmPassword" style={{
//                             color: '#3f3d56',
//                             fontWeight: 500,
//                             fontSize: '1rem',
//                         }}>Confirm New Password</label>
//                         <div style={{ position: 'relative' }}>
//                             <input
//                                 id="confirmPassword"
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 placeholder="Confirm New Password"
//                                 value={confirmPassword}
//                                 onChange={handleConfirmPasswordChange}
//                                 required
//                                 style={{
//                                     width: '100%',
//                                     boxSizing: 'border-box',
//                                     padding: '0.75rem 2.5rem 0.75rem 1rem',
//                                     borderRadius: '8px',
//                                     border: `1px solid ${confirmPassword && !passwordsMatch ? '#ef4444' : '#c3cfe2'}`,
//                                     background: '#f7f8fa',
//                                     fontSize: '1rem',
//                                     outline: 'none',
//                                     color: '#222'
//                                 }}
//                             />
//                             <span
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 style={{
//                                     position: 'absolute',
//                                     right: '0.75rem',
//                                     top: '50%',
//                                     transform: 'translateY(-50%)',
//                                     cursor: 'pointer',
//                                     color: '#888',
//                                 }}
//                             >
//                                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>

//                         {/* Password Match Indicator */}
//                         {confirmPassword && (
//                             <div style={{
//                                 marginTop: '0.3rem',
//                                 fontSize: '0.75rem',
//                                 color: passwordsMatch ? '#22c55e' : '#ef4444',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '0.5rem'
//                             }}>
//                                 {passwordsMatch ? <FaCheck size={12} /> : <FaTimes size={12} />}
//                                 <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
//                             </div>
//                         )}
//                     </div>

//                     <button type="submit" style={{
//                         padding: '0.75rem 1rem',
//                         borderRadius: '8px',
//                         border: 'none',
//                         background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//                         color: '#fff',
//                         fontWeight: 600,
//                         fontSize: '1.1rem',
//                         cursor: 'pointer',
//                         boxShadow: '0 2px 8px rgba(102,126,234,0.12)'
//                     }}>
//                         Reset Password
//                     </button>

//                     {message && <p style={{ color: 'green', textAlign: 'center', margin: 0 }}>{message}</p>}
//                     {error && <p style={{ color: 'red', textAlign: 'center', margin: 0 }}>{error}</p>}
//                 </form>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import '../styles/User/ResetPassword.css';

const PasswordRequirement = ({ met, text }) => (
  <div className={`password-requirement ${met ? 'met' : 'unmet'}`}>
    {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
    <span>{text}</span>
  </div>
);

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
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
                special: false
            });
            setIsPasswordValid(true);
            return false;
        }

        const validation = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        setPasswordValidation(validation);
        const isValid = Object.values(validation).every(Boolean);
        setIsPasswordValid(isValid);
        return isValid;
    };

    // Check if passwords match
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
        setMessage('');
        setError('');
        setLoading(true);

        if (!validatePassword(password)) {
            setError('Please ensure your password meets all requirements');
            setLoading(false);
            return;
        }

        if (!checkPasswordsMatch(password, confirmPassword)) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <Link to="/" className="home-icon" aria-label="Go to homepage">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#667eea" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                </svg>
            </Link>

            <div className="reset-password-card">
                <div className="avatar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                        <path d="M12 2a7 7 0 0 1 7 7v2h1a2 2 0 0 1 2 2v9H2v-9a2 2 0 0 1 2-2h1V9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v2h10V9a5 5 0 0 0-5-5Z"/>
                    </svg>
                </div>

                <h1 className="reset-password-title">Reset Password</h1>

                <p className="reset-password-subtitle">
                    Enter your new password below
                </p>

                <form onSubmit={handleReset} className="reset-password-form">
                    {/* New Password */}
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                className={`form-input ${password && !isPasswordValid ? 'invalid' : ''}`}
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
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                className={`form-input ${confirmPassword && !passwordsMatch ? 'invalid' : ''}`}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Password Match Indicator */}
                        {confirmPassword && (
                            <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                {passwordsMatch ? <FaCheck size={12} /> : <FaTimes size={12} />}
                                <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`reset-password-btn ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}