import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaLock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../styles/User/ChangePassword.css';
import { showMessage } from '../utils/Message';

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
            showMessage(res.data.message || 'Password changed successfully! Logging out...', 'success');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to change password!', 'error');
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
                <FaArrowLeft size={22} color="#667eea" />
            </button>

            {/* Main card - same styling as Register */}
            <div className="change-password-card">
                <div className="avatar-icon">
                    <FaLock size={32} color="#fff" />
                </div>

                <h1 className="change-password-title">Change Password</h1>

                <p className="change-password-subtitle">
                    Please enter your current and new password
                </p>

                <form onSubmit={handleChange} className="change-password-form">
                    {/* Current Password */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label htmlFor="currentPassword" style={{
                            color: '#3f3d56',
                            fontWeight: 500,
                            fontSize: '1rem',
                            minWidth: 90,
                            textAlign: 'left',
                            width: '40%',
                            display: 'block'
                        }}>Current Password</label>
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
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <label htmlFor="newPassword" style={{
                            color: '#3f3d56',
                            fontWeight: 500,
                            fontSize: '1rem',
                            minWidth: 90,
                            textAlign: 'left',
                            width: '40%',
                            display: 'block',
                            marginTop: '0.75rem'
                        }}>New Password</label>
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
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <label htmlFor="confirmPassword" style={{
                            color: '#3f3d56',
                            fontWeight: 500,
                            fontSize: '1rem',
                            minWidth: 90,
                            textAlign: 'left',
                            width: '40%',
                            display: 'block',
                            marginTop: '0.75rem'
                        }}>Confirm New Password</label>
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