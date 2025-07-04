// frontend/src/pages/StudentDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiLogOut,
    FiHome,
    FiBook,
    FiUsers,
    FiCheckCircle,
    FiUploadCloud,
    FiUser,
    FiSun, // For light mode icon
    FiMoon, // For dark mode icon
} from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion"; // For advanced animations
import axios from 'axios';

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

// Import your existing components
import ProfileSection from "../components/student/ProfileSection";
import CourseList from "../components/student/CourseList";
import CourseExams from "../components/student/CourseExams";
import ViewMarks from "../components/student/ViewMarks";
import DashboardOverview from "../components/student/DashboardOverview";
import PeerEvaluationsPending from "../components/student/PeerEvaluationsPending";
import EnrollmentSection from "../components/student/EnrollmentSection";

// Custom "Pinkish, Lilac, Purple & Yellow" Palette - Revised Mix (Light Mode)
const lightPalette = {
    'bg-primary': '#FFFBF6',         // Very Light Creamy Yellow (dominant background)
    'bg-secondary': '#FFFAF2',       // Slightly darker creamy yellow (for card/section backgrounds)
    'accent-bright-yellow': '#FFD700', // Bright Gold/Yellow (main energetic accent)
    'accent-light-yellow': '#FFECB3', // Lighter Yellow (for subtle use)
    'accent-pink': '#FF8DA1',        // Primary Pink Accent
    'accent-lilac': '#C8A2C8',       // Soft Lilac (modern cool accent)
    'accent-purple': '#800080',      // Deep Purple (primary purple accent)
    'accent-light-purple': '#DDA0DD', // Medium Lilac/Purple (for subtle use)
    'sidebar-bg': '#E6E6FA',         // Lavender Blush (sidebar background)
    'text-dark': '#4B0082',          // Indigo (Very Dark Purple for primary text on light backgrounds)
    'text-muted': '#A9A9A9',         // Dark Gray (Medium Gray for secondary text/borders)
    'text-sidebar-dark': '#4B0082', // Dark text for sidebar for contrast on light lavender
    'border-soft': '#F0E6EF',        // Very Light Pinkish-Purple for subtle borders
    'shadow-light': 'rgba(128, 0, 128, 0.04)',  // Very light, subtle purple shadows
    'shadow-medium': 'rgba(128, 0, 128, 0.08)', // Medium subtle purple shadows
    'shadow-strong': 'rgba(128, 0, 128, 0.15)', // Stronger subtle purple shadows
    'white': '#FFFFFF',               // Add white for button text
};

const darkPalette = {
    'bg-primary': '#1A1A2E',
    'bg-secondary': '#16213E',
    'accent-bright-yellow': '#FFEB3B',
    'accent-light-yellow': '#FFEE58',
    'accent-pink': '#EC407A',
    'accent-lilac': '#9C27B0',
    'accent-purple': '#6A1B9A',
    'accent-light-purple': '#8E24AA',
    'sidebar-bg': '#0F3460',
    'text-dark': '#E0E0E0',
    'text-muted': '#B0BEC5',
    'text-sidebar-dark': '#E0E0E0',
    'border-soft': '#3F51B5',
    'shadow-light': 'rgba(0, 0, 0, 0.2)',
    'shadow-medium': 'rgba(0, 0, 0, 0.4)',
    'shadow-strong': 'rgba(0, 0, 0, 0.6)',
    'white': '#FFFFFF',               // Add white for button text
};

type Palette = typeof lightPalette;

const getColors = (isDarkMode: boolean): Palette => isDarkMode ? darkPalette : lightPalette;



const StudentDashboard = () => {
    const [token] = useState(localStorage.getItem('token'));

    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [logoutDialog, setLogoutDialog] = useState(false);

    const [profileData, setProfileData] = useState({ name: "", email: "", role: "", isTA: false });
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const navigate = useNavigate();
    const currentPalette = getColors(darkMode); // Get current palette based on dark mode state

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        // Apply or remove 'dark' class from the document HTML element
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const ProfileSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700 dark:text-gray-200"
        >
        <path d="M18 20a6 6 0 0 0-12 0" />
        <circle cx="12" cy="10" r="4" />
        <circle cx="12" cy="12" r="10" />
    </svg>
    );

    const fetchData = async (url: string, setter: Function, errorMessage: string) => {
        try {
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setter(res.data);
            } catch (error) {
            console.error(errorMessage, error);
        }
    };
    useEffect(() => {
        if (!token) {
            navigate('/'); // Redirect to login
            return;
        }
        fetchData(`http://localhost:${PORT}/api/student/profile`, setProfileData, 'Failed to fetch profile');
      }, [token, navigate]);

    // Common Tailwind classes for cards and buttons based on the new palette
    const commonCardClasses = `
        rounded-xl p-6 space-y-4 border transition-all duration-300
        hover:shadow-xl transform hover:translate-y-[-4px]
    `;
    const getCardStyles = () => ({
        backgroundColor: currentPalette['bg-secondary'],
        borderColor: currentPalette['border-soft'],
        boxShadow: `0 8px 20px ${currentPalette['shadow-medium']}`,
    });

    const commonButtonClasses = `
        px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md active:scale-95 transform
        focus:outline-none focus:ring-2 focus:ring-offset-2
    `;
    const getButtonStyles = (colorKey: keyof Palette, textColorKey: keyof Palette = 'text-dark') => ({
        backgroundColor: currentPalette[colorKey],
        color: currentPalette[textColorKey],
        boxShadow: `0 4px 15px ${currentPalette[colorKey]}40`,
        '--tw-ring-color': currentPalette[colorKey] + '50', // For focus ring
    });


    const renderContent = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMenu} // Key is crucial for AnimatePresence to detect changes
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full" // Ensure it takes full width within the container
                >
                    {(() => {
                        switch (activeMenu) {
                            case 'dashboard':
                                return <DashboardOverview />;
                            case 'courses':
                                return selectedCourseId ? (
                                    <CourseExams
                                        courseId={selectedCourseId}
                                        onBack={() => setSelectedCourseId(null)}
                                    />
                                ) : (
                                    <CourseList onSelectCourse={(id) => setSelectedCourseId(id)} />
                                );
                            case 'enrollment':
                                return <EnrollmentSection />;
                            case 'peerEvaluation':
                                return <PeerEvaluationsPending />;
                            case 'viewMarks':
                                return <ViewMarks />;

                            case 'profile':
                                return <ProfileSection />;
                            default:
                                return (
                                    <div className={`${commonCardClasses} text-center`} style={getCardStyles()}>
                                        <p className="text-lg" style={{ color: currentPalette['text-muted'] }}>Please select an option from the sidebar.</p>
                                    </div>
                                );
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden relative" style={{
            background: currentPalette['bg-primary']
        }}>
            {/* Subtle background pattern for visual interest, blending with white */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(currentPalette['text-muted'])}' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M3 0L0 3l3 3 3-3z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
                background: `linear-gradient(135deg, ${currentPalette['bg-primary']} 0%, ${currentPalette['bg-primary']} 50%, ${currentPalette['bg-primary']} 100%)`
            }}></div>

            {/* Sidebar */}
            <motion.div
                // Removed custom animation classes that rely on tailwind.config.js
                className={`flex flex-col justify-between py-6 px-4 rounded-r-3xl transition-all duration-300 shadow-xl z-20 overflow-hidden ${showSidebar ? 'w-64' : 'w-20'}`}
                style={{
                    backgroundColor: currentPalette['sidebar-bg'],
                    backgroundImage: `linear-gradient(180deg, ${currentPalette['sidebar-bg']}, ${currentPalette['sidebar-bg']}E0)`,
                    boxShadow: `8px 0 30px ${currentPalette['shadow-medium']}`
                }}
            >
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="self-start mb-6 p-2 border-2 border-transparent rounded-full active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2"
                    style={{ borderColor: currentPalette['accent-lilac'], '--tw-ring-color': currentPalette['accent-lilac'] + '70' } as React.CSSProperties & Record<string, any>}
                >
                    <FiMenu className="text-2xl" style={{ color: currentPalette['text-sidebar-dark'] }} />
                </button>
                <div className="flex-1 flex flex-col items-center">
                    <h2 className={`font-bold mb-10 mt-4 transition-all duration-300 ${showSidebar ? 'text-2xl' : 'text-lg'}`} style={{ color: currentPalette['text-sidebar-dark'] }}>
                        {showSidebar ? 'Student Panel' : 'Stu'}
                    </h2>
                    <ul className="space-y-3 w-full">
                        {[
                            { key: 'dashboard', icon: FiHome, label: 'Dashboard' },
                            { key: 'courses', icon: FiBook, label: 'Courses' },
                            { key: 'enrollment', icon: FiUploadCloud, label: 'Enrollment' },
                            { key: 'peerEvaluation', icon: FiUsers, label: 'Peer Evaluation' },
                            { key: 'viewMarks', icon: FiCheckCircle, label: 'View Marks' },
                            { key: 'profile', icon: FiUser, label: 'Profile' }
                        ].map(({ key, icon: Icon, label }) => (
                            <motion.li
                                key={key}
                                onClick={() => {
                                    setActiveMenu(key);
                                    setSelectedCourseId(null);
                                }}
                                className={`cursor-pointer flex items-center px-4 py-2 rounded-lg transition-all duration-200 transform
                                     ${activeMenu === key ? 'scale-100 relative' : 'hover:scale-[1.02]'}
                                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                `}
                                style={{
                                    color: currentPalette['text-sidebar-dark'],
                                }}
                                whileHover={{ scale: 1.03, x: 5, boxShadow: `0 0 10px ${currentPalette['shadow-light']}` }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {activeMenu === key && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 rounded-lg -z-10"
                                        style={{
                                            backgroundColor: currentPalette['accent-light-purple'] + '20',
                                            boxShadow: `0 0 15px ${currentPalette['accent-light-purple']}40`
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon className={`transition-all duration-300 ${showSidebar ? 'mr-3 text-xl' : 'text-3xl'}`} />
                                {showSidebar && <span className="font-medium whitespace-nowrap">{label}</span>}
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <motion.button
                    onClick={() => setLogoutDialog(true)}
                    className="flex items-center justify-center gap-2 hover:opacity-80 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 mt-auto" // Added mt-auto to push to bottom
                    style={{ color: currentPalette['text-sidebar-dark'] }}
                    // Set --tw-ring-color via a wrapping div or a global CSS variable if needed
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FiLogOut className={`${showSidebar ? 'mr-3 text-xl' : 'text-3xl'}`} />
                    {showSidebar && <span className="font-medium whitespace-nowrap">Logout</span>}
                </motion.button>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-y-auto p-4 flex flex-col z-10"> 
            
                <div className="w-full flex justify-end pr-10">
                    <div className="relative">
                        <button
                            onClick={() => setShowProfilePopup(!showProfilePopup)}
                            className="p-2 flex items-center justify-center rounded-full border-2 border-transparent hover:border-blue-300 transition active:scale-95 bg-white shadow"
                            style={{ boxShadow: '0 2px 14px 0 rgba(87,65,141,0.16)' }}
                        >
                            <ProfileSVG />
                        </button>

                        {showProfilePopup && (
                            <div
                            className="absolute right-0 mt-3 w-80 p-4 z-50"
                            style={{
                                backgroundColor: currentPalette['bg-secondary'],
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 24,
                                borderBottomRightRadius: 24,
                                boxShadow: `0 4px 14px ${currentPalette['shadow-medium']}`,
                                color: currentPalette['text-dark']
                            }}
                            >
                            <h2 className="text-xl font-bold mb-4">Profile Info</h2>
                            <div className="space-y-2 mb-4 text-sm">
                                <p><strong>Name:</strong> {profileData.name}</p>
                                <p><strong>Email:</strong> {profileData.email}</p>
                                <p><strong>Role:</strong> {profileData.role}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowProfilePopup(false);
                                    setActiveMenu('profile') // or the route you want
                                }}
                                className="w-full rounded-3xl px-4 py-2"
                                style={{
                                backgroundColor: currentPalette['accent-purple'],
                                color: 'white',
                                boxShadow: `0 4px 15px ${currentPalette['accent-purple']}40`
                                }}
                            >
                                Go to Profile
                            </button>
                            {profileData.isTA && (
                            <button
                                onClick={() => navigate("/ta")}
                                className="w-full rounded-3xl px-4 py-2 mt-3"
                                style={{
                                backgroundColor: currentPalette['accent-bright-yellow'],
                                color: '#000',
                                boxShadow: `0 4px 15px ${currentPalette['accent-bright-yellow']}40`
                                }}
                            >
                                Go to TA Dashboard
                            </button>
                            )}

                            </div>
                        )}
                        </div>
                    </div>
                
                <div
                    className="rounded-xl shadow-xl w-full h-auto mt-8 mb-8 p-6 flex items-start justify-center overflow-auto max-w-5xl mx-auto transform transition-all duration-300" // Adjusted max-w
                    style={{
                        minHeight: "calc(100vh - 64px)", // Adjusted minHeight based on p-4
                        backgroundColor: currentPalette['bg-primary'],
                        boxShadow: `0 10px 40px ${currentPalette['shadow-medium']}`
                    }}
                >
                    {renderContent()}
                </div>
            </div>

            {/* Logout Dialog */}
            <AnimatePresence>
                {logoutDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="rounded-lg p-6 w-80 text-center shadow-2xl"
                            style={{ backgroundColor: currentPalette['bg-primary'], boxShadow: `0 8px 25px ${currentPalette['shadow-strong']}` }}
                        >
                            <p className="text-lg font-semibold" style={{ color: currentPalette['text-dark'] }}>Are you sure you want to logout?</p>
                            <div className="flex justify-around mt-6 space-x-4">
                                <button
                                    onClick={() => setLogoutDialog(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setLogoutDialog(false); handleLogout(); }}
                                    className={`${commonButtonClasses} focus:ring-offset-2`}
                                    style={getButtonStyles('accent-purple', 'white')} // Changed text color to white for better contrast on purple
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 right-6 z-20">
                <button
                    onClick={toggleDarkMode}
                    className="h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                        backgroundColor: darkMode ? currentPalette['accent-purple'] : currentPalette['accent-lilac'],
                        color: 'white', // Ensure text color is white for both modes
                        boxShadow: darkMode ? `0 4px 15px ${currentPalette['accent-purple']}60` : `0 4px 15px ${currentPalette['accent-lilac']}60`,
                        // @ts-ignore
                        ['--tw-ring-color' as any]: darkMode ? currentPalette['accent-purple'] + '70' : currentPalette['accent-lilac'] + '70'
                    } as React.CSSProperties & Record<string, any>}
                >
                    {darkMode ? (
                        <FiMoon className="w-6 h-6" />
                    ) : (
                        <FiSun className="w-6 h-6" />
                    )}
                </button>
            </div>


        </div>
    );
};

export default StudentDashboard;