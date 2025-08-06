// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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

// export default function ChangePassword() {
//     const navigate = useNavigate();
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
    
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
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

//     const checkPasswordsMatch = (newPass, confirmPass) => {
//         const match = newPass === confirmPass;
//         setPasswordsMatch(match);
//         return match;
//     };

//     const handleNewPasswordChange = (e) => {
//         const value = e.target.value;
//         setNewPassword(value);
//         validatePassword(value);
//         if (confirmPassword) {
//             checkPasswordsMatch(value, confirmPassword);
//         }
//     };

//     const handleConfirmPasswordChange = (e) => {
//         const value = e.target.value;
//         setConfirmPassword(value);
//         checkPasswordsMatch(newPassword, value);
//     };

//     const handleChange = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         if (!validatePassword(newPassword)) {
//             setError('Please ensure your new password meets all requirements');
//             return;
//         }

//         if (!checkPasswordsMatch(newPassword, confirmPassword)) {
//             setError('New passwords do not match');
//             return;
//         }

//         const token = localStorage.getItem('token');

//         try {
//             const res = await axios.post(
//                 'http://localhost:5000/api/auth/change-password',
//                 { currentPassword, newPassword },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     },
//                     withCredentials: true
//                 }
//             );
//             setMessage(res.data.message || 'Password changed successfully');
//             localStorage.removeItem('token');
//             localStorage.removeItem('role');
//             setTimeout(() => navigate('/login'), 2000);

//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to change password');
//         }
//     };

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             minHeight: '100vh',
//             minWidth: '100vw',
//             height: '100vh',
//             width: '100vw',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: 'linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)',
//             padding: '2rem',
//             boxSizing: 'border-box',
//             zIndex: 0,
//             overflow: 'auto',
//             scrollbarWidth: 'thin',
//             scrollbarColor: '#4b3c70 transparent'
//         }}>
//             {/* Back button */}
//             <button
//                 onClick={() => navigate(-1)}
//                 style={{
//                     position: 'fixed',
//                     top: 24,
//                     left: 24,
//                     zIndex: 2,
//                     background: '#fff',
//                     borderRadius: '50%',
//                     boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
//                     width: 40,
//                     height: 40,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     border: 'none',
//                     cursor: 'pointer',
//                     padding: 0
//                 }}
//                 aria-label="Go back"
//             >
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//                     <path d="M15 19l-7-7 7-7" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//             </button>

//             {/* Main card - same styling as Register */}
//             <div style={{
//                 background: '#fff',
//                 padding: '2.5rem 2rem',
//                 borderRadius: '20px',
//                 boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
//                 minWidth: '320px',
//                 maxWidth: '450px',
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 gap: '1.5rem',
//                 transition: 'box-shadow 0.2s',
//                 border: 'none',
//                 outline: 'none',
//                 margin: 'auto',
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
//                     marginBottom: '0.5rem',
//                     color: '#3f3d56',
//                     fontWeight: 700,
//                     letterSpacing: '1px',
//                     fontSize: '2rem'
//                 }}>Change Password</h1>

//                 <p style={{
//                     color: '#7a7a9d',
//                     textAlign: 'center',
//                     margin: 0,
//                     fontSize: '1rem'
//                 }}>
//                     Please enter your current and new password
//                 </p>

//                 <form onSubmit={handleChange} style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '1.2rem',
//                     width: '100%',
//                     marginTop: '1rem'
//                 }}>
//                     {/* Current Password */}
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                         <label htmlFor="currentPassword" style={{
//                             color: '#3f3d56',
//                             fontWeight: 500,
//                             fontSize: '1rem',
//                             minWidth: 90,
//                             textAlign: 'left',
//                             width: '40%',
//                             display: 'block'
//                         }}>Current Password</label>
//                         <div style={{ position: 'relative', flex: 1 }}>
//                             <input
//                                 id="currentPassword"
//                                 type={showCurrentPassword ? "text" : "password"}
//                                 placeholder="Enter current password"
//                                 value={currentPassword}
//                                 onChange={(e) => setCurrentPassword(e.target.value)}
//                                 required
//                                 style={{
//                                     width: '100%',
//                                     boxSizing: 'border-box',
//                                     padding: '0.75rem 2.5rem 0.75rem 1rem',
//                                     borderRadius: '8px',
//                                     border: '1px solid #c3cfe2',
//                                     fontSize: '1rem',
//                                     outline: 'none',
//                                     transition: 'border 0.2s',
//                                     background: '#f7f8fa',
//                                     boxShadow: 'none',
//                                     color: '#222'
//                                 }}
//                             />
//                             <span
//                                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                                 style={{
//                                     position: 'absolute',
//                                     right: '0.75rem',
//                                     top: '50%',
//                                     transform: 'translateY(-50%)',
//                                     cursor: 'pointer',
//                                     color: '#888'
//                                 }}
//                             >
//                                 {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>
//                     </div>

//                     {/* New Password */}
//                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
//                         <label htmlFor="newPassword" style={{
//                             color: '#3f3d56',
//                             fontWeight: 500,
//                             fontSize: '1rem',
//                             minWidth: 90,
//                             textAlign: 'left',
//                             width: '40%',
//                             display: 'block',
//                             marginTop: '0.75rem'
//                         }}>New Password</label>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ position: 'relative' }}>
//                                 <input
//                                     id="newPassword"
//                                     type={showNewPassword ? "text" : "password"}
//                                     placeholder="Enter new password"
//                                     value={newPassword}
//                                     onChange={handleNewPasswordChange}
//                                     required
//                                     style={{
//                                         width: '100%',
//                                         boxSizing: 'border-box',
//                                         padding: '0.75rem 2.5rem 0.75rem 1rem',
//                                         borderRadius: '8px',
//                                         border: `1px solid ${newPassword && !isPasswordValid ? '#ef4444' : '#c3cfe2'}`,
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         transition: 'border 0.2s',
//                                         background: '#f7f8fa',
//                                         boxShadow: 'none',
//                                         color: '#222'
//                                     }}
//                                 />
//                                 <span
//                                     onClick={() => setShowNewPassword(!showNewPassword)}
//                                     style={{
//                                         position: 'absolute',
//                                         right: '0.75rem',
//                                         top: '50%',
//                                         transform: 'translateY(-50%)',
//                                         cursor: 'pointer',
//                                         color: '#888'
//                                     }}
//                                 >
//                                     {showNewPassword ? <FaEyeSlash /> : <FaEye />}
//                                 </span>
//                             </div>

//                             {/* Password Requirements */}
//                             {newPassword && (
//                                 <div style={{
//                                     marginTop: '0.5rem',
//                                     padding: '0.75rem',
//                                     background: '#f8f9fa',
//                                     borderRadius: '6px',
//                                     border: '1px solid #e9ecef'
//                                 }}>
//                                     <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: '#495057' }}>
//                                         Password Requirements:
//                                     </div>
//                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
//                                         <PasswordRequirement 
//                                             met={passwordValidation.length} 
//                                             text="At least 8 characters" 
//                                         />
//                                         <PasswordRequirement 
//                                             met={passwordValidation.uppercase} 
//                                             text="One uppercase letter (A-Z)" 
//                                         />
//                                         <PasswordRequirement 
//                                             met={passwordValidation.lowercase} 
//                                             text="One lowercase letter (a-z)" 
//                                         />
//                                         <PasswordRequirement 
//                                             met={passwordValidation.number} 
//                                             text="One number (0-9)" 
//                                         />
//                                         <PasswordRequirement 
//                                             met={passwordValidation.special} 
//                                             text="One special character (!@#$%^&*)" 
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Confirm Password */}
//                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
//                         <label htmlFor="confirmPassword" style={{
//                             color: '#3f3d56',
//                             fontWeight: 500,
//                             fontSize: '1rem',
//                             minWidth: 90,
//                             textAlign: 'left',
//                             width: '40%',
//                             display: 'block',
//                             marginTop: '0.75rem'
//                         }}>Confirm New Password</label>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ position: 'relative' }}>
//                                 <input
//                                     id="confirmPassword"
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     placeholder="Confirm new password"
//                                     value={confirmPassword}
//                                     onChange={handleConfirmPasswordChange}
//                                     required
//                                     style={{
//                                         width: '100%',
//                                         boxSizing: 'border-box',
//                                         padding: '0.75rem 2.5rem 0.75rem 1rem',
//                                         borderRadius: '8px',
//                                         border: `1px solid ${confirmPassword && !passwordsMatch ? '#ef4444' : '#c3cfe2'}`,
//                                         fontSize: '1rem',
//                                         outline: 'none',
//                                         transition: 'border 0.2s',
//                                         background: '#f7f8fa',
//                                         boxShadow: 'none',
//                                         color: '#222'
//                                     }}
//                                 />
//                                 <span
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     style={{
//                                         position: 'absolute',
//                                         right: '0.75rem',
//                                         top: '50%',
//                                         transform: 'translateY(-50%)',
//                                         cursor: 'pointer',
//                                         color: '#888'
//                                     }}
//                                 >
//                                     {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                                 </span>
//                             </div>

//                             {/* Password Match Indicator */}
//                             {confirmPassword && (
//                                 <div style={{
//                                     marginTop: '0.3rem',
//                                     fontSize: '0.75rem',
//                                     color: passwordsMatch ? '#22c55e' : '#ef4444',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '0.5rem'
//                                 }}>
//                                     {passwordsMatch ? <FaCheck size={12} /> : <FaTimes size={12} />}
//                                     <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
//                                 </div>
//                             )}
//                         </div>
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
//                         boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
//                         transition: 'background 0.2s'
//                     }}>
//                         Change Password
//                     </button>

//                     {message && <p style={{ color: 'green', textAlign: 'center', margin: 0 }}>{message}</p>}
//                     {error && <p style={{ color: 'red', textAlign: 'center', margin: 0 }}>{error}</p>}
//                 </form>
//             </div>

//             {/* Custom scrollbar styles */}
//             <style>{`
//                 html, body {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                     background: linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%);
//                     min-height: 100vh;
//                     min-width: 100vw;
//                     overflow: hidden;
//                 }

//                 /* Webkit scrollbar styling */
//                 div::-webkit-scrollbar {
//                     width: 8px;
//                 }
                
//                 div::-webkit-scrollbar-track {
//                     background: transparent;
//                 }
                
//                 div::-webkit-scrollbar-thumb {
//                     background: #4b3c70;
//                     border-radius: 4px;
//                 }
                
//                 div::-webkit-scrollbar-thumb:hover {
//                     background: #3a2d5a;
//                 }

//                 @media (max-width: 600px) {
//                     div[style*="background: #fff"] {
//                         min-width: 90vw !important;
//                         padding: 1.5rem 0.5rem !important;
//                         border-radius: 12px !important;
//                         max-height: 85vh !important;
//                     }
//                     h1 {
//                         font-size: 1.5rem !important;
//                     }
//                     div[style*="display: flex"][style*="gap: 1rem"] {
//                         flex-direction: column !important;
//                         align-items: stretch !important;
//                         gap: 0.5rem !important;
//                     }
//                     label {
//                         min-width: 0 !important;
//                         text-align: left !important;
//                     }
                    
//                     div::-webkit-scrollbar {
//                         width: 6px;
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
//         </div>
//     );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import '../styles/User/ChangePassword.css';

const PasswordRequirement = ({ met, text }) => (
  <div className={`password-requirement ${met ? 'met' : 'unmet'}`}>
    {met ? <FaCheck size={12} /> : <FaTimes size={12} />}
    <span>{text}</span>
  </div>
);

export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
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

    const checkPasswordsMatch = (newPass, confirmPass) => {
        const match = newPass === confirmPass;
        setPasswordsMatch(match);
        return match;
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        validatePassword(value);
        if (confirmPassword) {
            checkPasswordsMatch(value, confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        checkPasswordsMatch(newPassword, value);
    };

    const handleChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!validatePassword(newPassword)) {
            setError('Please ensure your new password meets all requirements');
            return;
        }

        if (!checkPasswordsMatch(newPassword, confirmPassword)) {
            setError('New passwords do not match');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/change-password',
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setMessage(res.data.message || 'Password changed successfully');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="change-password-container">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="back-button"
                aria-label="Go back"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M15 19l-7-7 7-7" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Main card */}
            <div className="change-password-card">
                <div className="avatar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                        <path d="M12 2a7 7 0 0 1 7 7v2h1a2 2 0 0 1 2 2v9H2v-9a2 2 0 0 1 2-2h1V9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v2h10V9a5 5 0 0 0-5-5Z"/>
                    </svg>
                </div>

                <h1 className="change-password-title">Change Password</h1>

                <p className="change-password-subtitle">
                    Please enter your current and new password
                </p>

                <form onSubmit={handleChange} className="change-password-form">
                    {/* Current Password */}
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="password-container">
                            <input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                            <span
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="password-toggle"
                            >
                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group password-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-wrapper">
                            <div className="password-container">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    required
                                    className={`form-input ${newPassword && !isPasswordValid ? 'invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="password-toggle"
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {/* Password Requirements */}
                            {newPassword && (
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

                    {/* Confirm Password */}
                    <div className="form-group password-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-wrapper">
                            <div className="password-container">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                    className={`form-input ${confirmPassword && !passwordsMatch ? 'invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
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
                    </div>

                    <button type="submit" className="change-password-btn">
                        Change Password
                    </button>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}