import { FaUser, FaSignInAlt, FaUserPlus, FaClock, FaCheckSquare, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import '../styles/User/Homepage.css';

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
        <div className="homepage-root">
            <div className="homepage-card">
                {/* Decorative gradient circle */}
                <div className="homepage-gradient-circle" />
                {/* Logo */}
                <div className="homepage-logo">
                    <FaUser size={36} color="#fff" />
                </div>
                <h1 className="homepage-title">
                    Peer Evaluation System
                </h1>
                <div className="homepage-subtitle">
                    Welcome! Please login or register to continue.
                </div>
                {/* Features */}
                <div className="homepage-features">
                    {featureList.map((f, i) => (
                        <div key={i} className="homepage-feature">
                            <div style={{ marginBottom: 6 }}>{f.icon}</div>
                            <div className="homepage-feature-title">{f.title}</div>
                            <div className="homepage-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
                {/* Buttons */}
                <div className="homepage-buttons-row">
                    <div className="homepage-btn-container">
                        <button
                            className="homepage-icon-btn"
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
                        <div className="homepage-btn-label">Login</div>
                    </div>
                    <div className="homepage-btn-container">
                        <button
                            className="homepage-icon-btn register"
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
                        <div className="homepage-btn-label">Register</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;