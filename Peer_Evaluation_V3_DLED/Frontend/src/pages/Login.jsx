import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import { showMessage } from '../utils/Message'; // Assuming you have a utility for showing messages

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const res = await axios.post('http://localhost:5000/api/auth/login', {
    //             email,
    //             password,
    //         });

    //         const { token, role } = res.data;

    //         // Save token and role in localStorage
    //         localStorage.setItem('token', token);
    //         localStorage.setItem('role', role);

    //         // Navigate according to role
    //         if (role === 'admin') navigate('/admin');
    //         else if (role === 'teacher') navigate('/teacher');
    //         else if (role === 'ta') navigate('/ta');
    //         else navigate('/student');
    //     } catch (err) {
    //         showMessage('Login failed. Please check your credentials.', 'error');
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
            // Successful login
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'teacher') navigate('/teacher');
            else navigate('/student');
            showMessage('Login successful!', 'success');
            } else {
            if (data.requiresVerification) {
                // User needs email verification
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            minHeight: '100vh',
            minWidth: '100vw',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)',
            padding: '2rem',
            boxSizing: 'border-box',
            zIndex: 0
        }}>
            <Link to="/" style={{
                position: 'absolute',
                top: 24,
                left: 24,
                zIndex: 2,
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
            }} aria-label="Go to homepage">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#667eea" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                </svg>
            </Link>
            <div
                style={{
                    background: '#fff',
                    padding: '2.5rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
                    minWidth: '320px',
                    maxWidth: '420px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'box-shadow 0.2s',
                    border: 'none',
                    outline: 'none',
                }}
            >
                <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    boxShadow: '0 2px 12px rgba(102,126,234,0.18)'
                }}>
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                        <path fill="#fff" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/>
                    </svg>
                </div>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    color: '#3f3d56',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    fontSize: '2rem'
                }}>Welcome Back</h1>
                <p style={{
                    color: '#7a7a9d',
                    textAlign: 'center',
                    margin: 0,
                    fontSize: '1rem'
                }}>
                    Please sign in to your account
                </p>
                <form
                    onSubmit={handleLogin}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                        width: '100%',
                        marginTop: '1rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label
                            htmlFor="email"
                            style={{
                                color: '#3f3d56',
                                fontWeight: 500,
                                fontSize: '1rem',
                                minWidth: 90,
                                textAlign: 'left',
                                width: 90,
                                display: 'block'
                            }}
                        >Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #c3cfe2',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border 0.2s',
                                background: '#f7f8fa',
                                boxShadow: 'none',
                                color: '#222'
                            }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label
                            htmlFor="password"
                            style={{
                                color: '#3f3d56',
                                fontWeight: 500,
                                fontSize: '1rem',
                                minWidth: 90,
                                textAlign: 'left',
                                width: 90,
                                display: 'block'
                            }}
                        >Password</label>
                        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '0.75rem 2.5rem 0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #c3cfe2',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border 0.2s',
                                background: '#f7f8fa',
                                boxShadow: 'none',
                                color: '#222'
                                }}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#888'
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div style={{
                        textAlign: 'right',
                        marginTop: '-0.75rem',
                        marginBottom: '1rem',
                    }}>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#667eea',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: loading
                                ? 'rgba(102,126,234,0.5)'
                                : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div style={{
                    marginTop: '1rem',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                }}>
                    <span style={{ color: '#7a7a9d' }}>Don't have an account? </span>
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            padding: 0,
                            margin: 0
                        }}
                    >
                        Register
                    </button>
                </div>
            </div>
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
