import { useState } from 'react';
import { FaHome, FaArrowLeft, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
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
            {/* Home button (top-left) */}
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
                <FaHome size={22} color="#667eea" />
            </Link>

            {/* Updated Back Button (top-left-right-to-home, black theme) */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'absolute',
                    top: 24,
                    left: 70,
                    background: 'linear-gradient(90deg,  #764ba2 0%, #667eea 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '16px',
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    transition: 'background 0.2s, transform 0.15s',
                    boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = 'rgb(85, 112, 232)';
                    e.currentTarget.style.transform = 'scale(1.07)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = 'linear-gradient(90deg,  #764ba2 0%, #667eea 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Go back"
            >
                <FaArrowLeft size={22} color="#ffffff" />
            </button>


            <div style={{
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
                gap: '1.5rem'
            }}>
                <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(102,126,234,0.18)'
                }}>
                    <FaUser size={36} color="#fff" />
                </div>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    color: '#3f3d56',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    fontSize: '2rem'
                }}>Forgot Password</h1>
                <p style={{
                    color: '#7a7a9d',
                    textAlign: 'center',
                    margin: 0,
                    fontSize: '1rem'
                }}>
                    Enter your email to receive a reset link.
                </p>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                        width: '100%',
                        marginTop: '1rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label htmlFor="email" style={{
                            color: '#3f3d56',
                            fontWeight: 500,
                            fontSize: '1rem',
                            minWidth: 90,
                            textAlign: 'left',
                            width: 90
                        }}>Email</label>
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
                                background: '#f7f8fa',
                                color: '#222'
                            }}
                            required
                        />
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
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && <p style={{ color: 'green', fontSize: '0.95rem', textAlign: 'center' }}>{message}</p>}
                {error && <p style={{ color: 'red', fontSize: '0.95rem', textAlign: 'center' }}>{error}</p>}
            </div>

            {/* Mobile & large screen adjustments */}
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
