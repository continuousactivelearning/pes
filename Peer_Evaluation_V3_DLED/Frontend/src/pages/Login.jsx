import { useState } from 'react';
import { FaEyeSlash, FaEye, FaHome, FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showMessage } from '../utils/Message';
import '../styles/User/Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'teacher') navigate('/teacher');
                else navigate('/student');
                showMessage('Login successful!', 'success');
            } else {
                if (data.requiresVerification) {
                    showMessage(data.message, 'info');
                    setEmailForVerification(data.email || email);
                    setShowVerificationModal(true);
                } else {
                    showMessage(data.message || 'Login failed', 'error');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            <Link to="/" className="login-home-icon" aria-label="Go to homepage">
                <FaHome size={22} color="#667eea" />
            </Link>
            <div className="login-card">
                <div className="login-avatar">
                    <FaUser size={36} color="#fff" />
                </div>
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">
                    Please sign in to your account
                </p>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-form-group">
                        <label htmlFor="email" className="login-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password" className="login-label">Password</label>
                        <div className="login-password-container">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-password-toggle"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div className="login-forgot-row">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="login-forgot-btn"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="login-submit-btn"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="login-register-row">
                    <span className="login-register-text">Don't have an account? </span>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="login-register-btn"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}