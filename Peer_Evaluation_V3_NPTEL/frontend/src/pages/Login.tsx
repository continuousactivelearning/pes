import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMoon, FiSun } from 'react-icons/fi';
import axios from 'axios';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

const currentPalette = {
  'accent-purple': '#7c3aed',
  'accent-lilac': '#c4b5fd'
};

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showMessage = (message: string) => {
    alert(message); // Replace with modal or toast for better UX
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:${PORT}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { token, role, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('isTA', user.isTA ? 'true' : 'false');

      if (role === 'admin') navigate('/admin');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');

    } catch (err) {
      showMessage('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 font-[Poppins] ${darkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-indigo-100 to-purple-200'}`}>
      {/* Decorative blobs */}
      <div className="absolute w-72 h-72 bg-indigo-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob -top-20 -left-20 dark:bg-indigo-800"></div>
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000 -bottom-20 -right-10 dark:bg-purple-800"></div>

      {/* Home Button */}
      <Link to="/" className="absolute top-6 left-6 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md h-10 w-10 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Login Form */}
      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md transition hover:scale-105 duration-300 ease-in-out backdrop-blur-md border dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-500 text-white text-4xl rounded-full h-16 w-16 flex items-center justify-center shadow-lg">👤</div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">Login</h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-12"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-right -mt-2 mb-4">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-indigo-600 dark:text-indigo-400 text-sm underline hover:text-indigo-800 dark:hover:text-indigo-300 transition"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition shadow-md transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>

      {/* Dark Mode Toggle Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={toggleDarkMode}
          className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: darkMode ? currentPalette['accent-purple'] : currentPalette['accent-lilac'],
            color: 'white',
            boxShadow: darkMode
              ? `0 4px 15px ${currentPalette['accent-purple']}60`
              : `0 4px 15px ${currentPalette['accent-lilac']}60`,
            // @ts-ignore
            ['--tw-ring-color' as any]: darkMode
              ? currentPalette['accent-purple'] + '70'
              : currentPalette['accent-lilac'] + '70',
          }}
        >
          {darkMode ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
        </button>
      </div>

      {/* Animations & Input Styles */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.5rem;
          border: 1px solid #ccc;
          background: white;
          transition: 0.3s ease;
        }
        .dark .input-field {
          background-color: #1f2937;
          color: white;
          border-color: #374151;
        }
        .eye-icon {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}