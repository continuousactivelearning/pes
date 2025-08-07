import { FaUser, FaSignInAlt, FaUserPlus, FaClock, FaCheckSquare, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '50%',
    padding: '24px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.15s',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
};

const featureList = [
    {
        icon: <FaClock size={28} color="#667eea" />,
        title: "Track Progress",
        desc: "Monitor your evaluation status and feedback in real time."
    },
    {
        icon: <FaCheckSquare size={28} color="#14b8a6" />,
        title: "Easy Evaluation",
        desc: "Submit and review peer evaluations with a simple interface."
    },
    {
        icon: <FaShieldAlt size={28} color="#764ba2" />,
        title: "Secure & Private",
        desc: "Your data is encrypted and privacy is our top priority."
    }
];

const Homepage = () => {
    const navigate = useNavigate();

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
            <div
                style={{
                    background: '#fff',
                    padding: '2.5rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
                    minWidth: '320px',
                    maxWidth: '440px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: 'none',
                    transition: 'box-shadow 0.2s',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative gradient circle */}
                <div style={{
                    position: 'absolute',
                    top: -60,
                    right: -60,
                    width: 140,
                    height: 140,
                    background: 'radial-gradient(circle at 30% 30%, #667eea33 60%, transparent 100%)',
                    borderRadius: '50%',
                    zIndex: 0,
                }} />
                {/* Logo */}
                <div
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        boxShadow: '0 2px 12px rgba(102,126,234,0.18)',
                        zIndex: 1
                    }}
                >
                    <FaUser size={36} color="#fff" />
                </div>
                <h1 style={{
                    fontWeight: 700,
                    color: '#3f3d56',
                    fontSize: '2rem',
                    marginBottom: 8,
                    letterSpacing: '1px',
                    zIndex: 1
                }}>
                    Peer Evaluation System
                </h1>
                <div style={{ color: '#7a7a9d', fontSize: '1.1rem', marginBottom: 16, zIndex: 1 }}>
                    Welcome! Please login or register to continue.
                </div>
                {/* Features */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 16,
                    justifyContent: 'center',
                    margin: '12px 0 8px 0',
                    width: '100%',
                    zIndex: 1
                }}>
                    {featureList.map((f, i) => (
                        <div key={i} style={{
                            background: '#f6f8fc',
                            borderRadius: 12,
                            padding: '12px 10px',
                            minWidth: 0,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: '0 1px 4px rgba(102,126,234,0.07)',
                            margin: '0 2px'
                        }}>
                            <div style={{ marginBottom: 6 }}>{f.icon}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.97rem', color: '#3f3d56', marginBottom: 2 }}>{f.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#7a7a9d' }}>{f.desc}</div>
                        </div>
                    ))}
                </div>
                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: 48, justifyContent: 'center', marginTop: 32, zIndex: 1 }}>
                    <div>
                        <button
                            style={{
                                ...iconButtonStyle,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                color: '#fff',
                            }}
                            onClick={() => navigate('/login')}
                            onMouseOver={e => {
                                e.currentTarget.style.background = '#4f46e5';
                                e.currentTarget.style.transform = 'scale(1.07)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                            aria-label="Login"
                        >
                            <FaSignInAlt size={40} color="#ffffff" />
                        </button>
                        <div style={{ marginTop: 8, fontSize: '1rem', color: '#3f3d56', fontWeight: 500 }}>Login</div>
                    </div>
                    <div>
                        <button
                            style={{
                                ...iconButtonStyle,
                                background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)',
                                color: '#fff',
                            }}
                            onClick={() => navigate('/register')}
                            onMouseOver={e => {
                                e.currentTarget.style.background = '#0d9488';
                                e.currentTarget.style.transform = 'scale(1.07)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                            aria-label="Register"
                        >
                            <FaUserPlus size={40} color="#ffffff" />
                        </button>
                        <div style={{ marginTop: 8, fontSize: '1rem', color: '#3f3d56', fontWeight: 500 }}>Register</div>
                    </div>
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
                        min-width: 95vw !important;
                        padding: 1.2rem 0.3rem !important;
                        border-radius: 12px !important;
                    }
                    h1 {
                        font-size: 1.3rem !important;
                    }
                    div[style*="display: flex"][style*="gap: 48px"] {
                        flex-direction: column !important;
                        gap: 1.5rem !important;
                    }
                    div[style*="display: flex"][style*="gap: 16px"] {
                        flex-direction: column !important;
                        gap: 0.7rem !important;
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
};

export default Homepage;