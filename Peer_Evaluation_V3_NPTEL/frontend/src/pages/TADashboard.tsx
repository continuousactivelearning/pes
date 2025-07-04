import React, { useEffect, useState, type JSX } from 'react';
import {
  FiMenu,
  FiLogOut,
  FiHome,
  FiShield,
  FiDownload,
  FiEdit,
  FiSend,
  FiSun, // For light mode icon
  FiMoon, // For dark mode icon
  FiUsers, // For enrollments icon
  FiCheck, // For accept icon
  FiX, // For decline icon
} from 'react-icons/fi';
import { motion, AnimatePresence } from "framer-motion"; // For advanced animations
import HomePage from "../components/ta/HomePage";
import FlaggedEvaluationsPage from "../components/ta/FlaggedEvaluationsPage";
import ManageEnrollments from '../components/ta/ManageEnrollments';

// Update TAProfile interface
interface TAProfile {
  name: string;
  email: string;
  courses: Array<{
    _id: string;
    name: string;
    code: string;
  }>;
  batches: Array<{
    _id: string;
    name: string;
  }>;
}

// Update PendingEnrollment interface
interface PendingEnrollment {
  _id: string;
  student: {
    name: string;
    email: string;
  };
  course: {
    _id: string;
    name: string;
    code: string;
  };
  batch: {
    _id: string;
    name: string;
  };
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Replace FlaggedEvaluation interface with StudentTicket interface
interface StudentTicket {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  evaluator: {
    _id: string;
    name: string;
    email: string;
  };
  exam: {
    _id: string;
    title: string;
    startTime?: string;
    endTime?: string;
    numQuestions?: number;
    course?: {
      name: string;
      code: string;
    };
  };
  message: string;
  status: 'open' | 'closed';
  escalatedToTeacher: boolean;
  createdAt: string;
}

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

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

export type Palette = typeof lightPalette;

const getColors = (isDarkMode: boolean): Palette => isDarkMode ? darkPalette : lightPalette;

const TADashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activePage, setActivePage] = useState("home");
  const [showSidebar, setShowSidebar] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Initial state for dark mode
  const [commentDialog, setCommentDialog] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [comment, setComment] = useState('');
  const [updateMarksDialog, setUpdateMarksDialog] = useState<{
    show: boolean;
    id: string | null;
    ticket?: StudentTicket;
  }>({ show: false, id: null });
  const [newMarks, setNewMarks] = useState<number[]>([]);
  // Replace flaggedEvaluations with studentTickets
  const [studentTickets, setStudentTickets] = useState<StudentTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Add new state variables for TA profile and enrollments
  const [pendingEnrollments, setPendingEnrollments] = useState<PendingEnrollment[]>([]);
  const [taProfile, setTaProfile] = useState<TAProfile | null>(null);

  const token = localStorage.getItem('token');
  const currentPalette = getColors(darkMode); // Get current palette based on dark mode state

  // Effect to apply/remove dark mode class from the document html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Replace fetchFlaggedEvaluations with fetchStudentTickets
  const fetchStudentTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:${PORT}/api/ta/student-tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student tickets');
      }

      const data = await response.json();
      setStudentTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching student tickets:', err);
      setError('Failed to load student tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add new function to fetch TA profile
  const fetchTAProfile = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ta/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TA profile');
      }

      const data = await response.json();
      setTaProfile(data.profile);
    } catch (err) {
      console.error('Error fetching TA profile:', err);
      setError('Failed to load TA profile. Please try again.');
    }
  };

  // Add new function to fetch pending enrollments
  const fetchPendingEnrollments = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ta/pending-enrollments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending enrollments');
      }

      const data = await response.json();
      setPendingEnrollments(data.pendingEnrollments || []);
    } catch (err) {
      console.error('Error fetching pending enrollments:', err);
      // Don't show error to avoid cluttering the UI if this is a secondary feature
    }
  };

  // Update the useEffect to call our new functions
  useEffect(() => {
    fetchTAProfile();
    fetchStudentTickets();
    fetchPendingEnrollments();
  }, [activePage]);

  // Helper function to find evaluation for a ticket
  const findEvaluationForTicket = async (ticket: StudentTicket) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ta/evaluation/${ticket.exam._id}/${ticket.evaluator._id}/${ticket.student._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.evaluation;
      }
      return null;
    } catch (err) {
      console.error('Error fetching evaluation:', err);
      return null;
    }
  };

  const handleDownloadTranscript = async (ticket: StudentTicket) => {
    try {
      // First find the evaluation for this ticket
      const evaluation = await findEvaluationForTicket(ticket);
      if (!evaluation) {
        setError('Could not find evaluation for this ticket');
        return;
      }

      const response = await fetch(`http://localhost:${PORT}/api/ta/submission/${evaluation._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download submission');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `submission_${ticket.student.name}_${ticket.exam.title}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading transcript:', err);
      setError('Failed to download submission. Please try again.');
    }
  };

  const handleUpdateMarks = async (ticketId: string) => {
    try {
      const ticket = studentTickets.find(t => t._id === ticketId);
      if (!ticket) return;

      // Get current evaluation marks to pre-fill the form
      const evaluation = await findEvaluationForTicket(ticket);
      
      // Use exam's numQuestions if available, otherwise default to 5
      const numQuestions = ticket.exam.numQuestions || 5;
      const currentMarks = evaluation?.marks || Array(numQuestions).fill(0);

      setNewMarks([...currentMarks]);
      setUpdateMarksDialog({
        show: true,
        id: ticketId,
        ticket: ticket
      });
    } catch (err) {
      console.error('Error preparing marks update:', err);
      setError('Failed to prepare marks update. Please try again.');
    }
  };

  const handleMarkChange = (index: number, value: string) => {
    const updatedMarks = [...newMarks];
    updatedMarks[index] = Number(value);
    setNewMarks(updatedMarks);
  };

  const confirmUpdateMarks = async () => {
    if (!updateMarksDialog.id) return;

    try {
      setLoading(true);

      const invalidMarks = newMarks.some(mark =>
        isNaN(mark) || mark < 0 || mark > 20
      );

      if (invalidMarks) {
        alert("Please enter valid marks between 0 and 20 for all questions");
        return;
      }

      const response = await fetch(`http://localhost:${PORT}/api/ta/resolve-ticket/${updateMarksDialog.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resolution: 'Marks updated by TA',
          newMarks: newMarks,
          feedback: `Marks updated by TA on ${new Date().toLocaleDateString()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update marks');
      }

      setSuccessMessage('Marks updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);

      fetchStudentTickets();
    } catch (err) {
      console.error('Error updating marks:', err);
      setError('Failed to update marks. Please try again.');
    } finally {
      setLoading(false);
      setUpdateMarksDialog({ show: false, id: null });
      setNewMarks([]);
    }
  };

  const handleSendToTeacher = (ticketId: string) => {
    setCommentDialog({ show: true, id: ticketId });
  };

  const confirmSendToTeacher = async () => {
    if (!commentDialog.id) return;

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:${PORT}/api/ta/escalate-ticket/${commentDialog.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: comment })
      });

      if (!response.ok) {
        throw new Error('Failed to escalate to teacher');
      }

      setSuccessMessage('Ticket escalated to teacher successfully');
      setTimeout(() => setSuccessMessage(null), 3000);

      fetchStudentTickets();
    } catch (err) {
      console.error('Error escalating to teacher:', err);
      setError('Failed to escalate to teacher. Please try again.');
    } finally {
      setLoading(false);
      setCommentDialog({ show: false, id: null });
      setComment('');
    }
  };

  // Add function to handle enrollment decisions
  const handleEnrollmentDecision = async (enrollmentId: string, decision: 'approve' | 'reject') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:${PORT}/api/ta/enrollment/${enrollmentId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ decision })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${decision} enrollment`);
      }

      setSuccessMessage(`Enrollment ${decision === 'approve' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh enrollments after decision
      fetchPendingEnrollments();
    } catch (err) {
      console.error(`Error ${decision}ing enrollment:`, err);
      setError(`Failed to ${decision} enrollment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

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
  const getButtonStyles = (
  colorKey: keyof Palette,
  textColorKey: keyof Palette = 'text-dark'
): React.CSSProperties => ({
  backgroundColor: currentPalette[colorKey],
  color: currentPalette[textColorKey],
  boxShadow: `0 4px 15px ${currentPalette[colorKey]}40`,
  // @ts-ignore: Tailwind custom ring color fallback
  '--tw-ring-color': currentPalette[colorKey] + '50',
});


  const DialogBox = ({ show, message, children }: { show: boolean, message: string, children?: React.ReactNode }) => {
    if (!show) return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="rounded-lg p-6 w-80 text-center shadow-2xl"
          style={{ backgroundColor: currentPalette['bg-primary'], boxShadow: `0 8px 25px ${currentPalette['shadow-strong']}` }}
        >
          <div className="mb-2">
            {/* The SVG color is static, so it will not change with dark mode */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="#6ddf99" />
              <path d="M18 30l7 7 13-13" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-center mb-1" style={{ color: currentPalette['text-dark'] }}>{message}</div>
          {children}
        </motion.div>
      </motion.div>
    );
  };

  const renderContent = () => {
    const pages: Record<string, JSX.Element> = {
      home: (
        <HomePage
          flaggedEvaluations={flaggedEvaluations}
          loading={loading}
          error={error}
          successMessage={successMessage}
          currentPalette={currentPalette}
          getCardStyles={getCardStyles}
          handleUpdateMarks={handleUpdateMarks}
          handleSendToTeacher={handleSendToTeacher}
          setActivePage={setActivePage}
        />
      ),
      flagged: (
        <FlaggedEvaluationsPage
          flaggedEvaluations={flaggedEvaluations}
          loading={loading}
          error={error}
          successMessage={successMessage}
          currentPalette={currentPalette}
          commonCardClasses={commonCardClasses}
          getCardStyles={getCardStyles}
          handleDownloadTranscript={handleDownloadTranscript}
          handleUpdateMarks={handleUpdateMarks}
          handleSendToTeacher={handleSendToTeacher}
        />
      ),
      enrollments: (
      <ManageEnrollments
        currentPalette={currentPalette}
        getCardStyles={getCardStyles}
        getButtonStyles={getButtonStyles}
      />
    ),

    };
    return (
      <AnimatePresence mode="wait">
        <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
          {pages[activePage]}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: currentPalette['bg-primary'] }}>
      {/* Subtle background pattern for visual interest, blending with white */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(currentPalette['text-muted'])}' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M3 0L0 3l3 3 3-3z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          background: `linear-gradient(135deg, ${currentPalette['bg-primary']} 0%, ${currentPalette['bg-primary']} 50%, ${currentPalette['bg-primary']} 100%)`
      }}></div>

      {/* Sidebar */}
      <motion.div
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
                  {showSidebar ? 'TA Panel' : 'TA'}
              </h2>
              <ul className="space-y-3 w-full">
                  {[
                      { key: 'home', icon: FiHome, label: 'Dashboard' },
                      { key: 'flagged', icon: FiShield, label: 'Flagged Evaluations' },
                      {key: 'enrollments', icon: FiEdit, label: 'Manage Enrollments' },
                  ].map(({ key, icon: Icon, label }) => (
                      <motion.li
                          key={key}
                          onClick={() => setActivePage(key)}
                          className={`cursor-pointer flex items-center px-4 py-2 rounded-lg transition-all duration-200 transform
                               ${activePage === key ? 'scale-100 relative' : 'hover:scale-[1.02]'}
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                          `}
                          style={{
                              color: currentPalette['text-sidebar-dark'],
                          }}
                          whileHover={{ scale: 1.03, x: 5, boxShadow: `0 0 10px ${currentPalette['shadow-light']}` }}
                          whileTap={{ scale: 0.98 }}
                      >
                          {activePage === key && (
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
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
          >
              <FiLogOut className={`${showSidebar ? 'mr-3 text-xl' : 'text-3xl'}`} />
              {showSidebar && <span className="font-medium whitespace-nowrap">Logout</span>}
          </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-y-auto p-4 flex flex-col z-10">
          <div
              className="rounded-xl shadow-xl w-full h-auto mt-8 mb-8 p-6 flex items-start justify-center overflow-auto max-w-5xl mx-auto transform transition-all duration-300"
              style={{
                  minHeight: "calc(100vh - 64px)", // Adjusted minHeight based on p-4
                  backgroundColor: currentPalette['bg-secondary'], // Changed to bg-secondary for card
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
                              style={{
                                  backgroundColor: currentPalette['bg-secondary'],
                                  color: currentPalette['text-dark'],
                                  boxShadow: `0 2px 10px ${currentPalette['shadow-light']}`
                              }}
                          >
                              Cancel
                          </button>
                          <button
                              onClick={() => { setLogoutDialog(false); onLogout ? onLogout() : window.location.href = "/login"; }}
                              className={`${commonButtonClasses} focus:ring-offset-2`}
                              style={getButtonStyles('accent-purple', 'white')}
                          >
                              Logout
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Comment Dialog */}
      <AnimatePresence>
          {commentDialog.show && (
              <DialogBox show={commentDialog.show} message="Add a comment before escalating">
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Explain why you're escalating this ticket..."
                      className="w-full border rounded-lg p-2 mb-4"
                      style={{
                          backgroundColor: currentPalette['bg-secondary'],
                          borderColor: currentPalette['border-soft'],
                          color: currentPalette['text-dark']
                      }} rows={3} />
                  <div className="flex gap-4">
                      <button onClick={() => setCommentDialog({ show: false, id: null })}
                          className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                          style={{
                              backgroundColor: currentPalette['bg-secondary'],
                              color: currentPalette['text-dark'],
                              boxShadow: `0 2px 10px ${currentPalette['shadow-light']}`
                          }}
                      >Cancel</button>
                      <button onClick={confirmSendToTeacher}
                          className={`${commonButtonClasses}`}
                          style={getButtonStyles('accent-purple', 'white')}
                      >Escalate</button>
                  </div>
              </DialogBox>
          )}
      </AnimatePresence>

      {/* Update Marks Dialog */}
      <AnimatePresence>
          {updateMarksDialog.show && (
              <DialogBox show={updateMarksDialog.show} message="Update evaluation marks">
                  <div className="w-full mb-4">
                      <div className="text-sm mb-3" style={{ color: currentPalette['text-muted'] }}>Enter marks for each question (0-20):</div>

                      {newMarks.map((mark, index) => (
                          <div key={index} className="mb-3">
                              <label className="block text-sm font-medium mb-1" style={{ color: currentPalette['text-dark'] }}>
                                  Question {index + 1}:
                              </label>
                              <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={mark}
                                  onChange={(e) => handleMarkChange(index, e.target.value)}
                                  className="w-full border rounded-lg p-2"
                                  style={{
                                      backgroundColor: currentPalette['bg-secondary'],
                                      borderColor: currentPalette['border-soft'],
                                      color: currentPalette['text-dark']
                                  }}
                              />
                          </div>
                      ))}

                      <div className="mt-3 text-right">
                          <strong style={{ color: currentPalette['text-dark'] }}>
                              Total: {newMarks.reduce((sum, mark) => sum + mark, 0)} / {(updateMarksDialog.ticket?.exam?.numQuestions || newMarks.length) * 20}
                          </strong>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      <button
                          onClick={() => setUpdateMarksDialog({ show: false, id: null })}
                          className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                          style={{
                              backgroundColor: currentPalette['bg-secondary'],
                              color: currentPalette['text-dark'],
                              boxShadow: `0 2px 10px ${currentPalette['shadow-light']}`
                          }}
                      >
                          Cancel
                      </button>
                      <button
                          onClick={confirmUpdateMarks}
                          className={`${commonButtonClasses}`}
                          style={getButtonStyles('accent-purple', 'white')}
                      >
                          Save Changes
                      </button>
                  </div>
              </DialogBox>
          )}
      </AnimatePresence>

      {/* Floating Dark Mode Toggle */}
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

export default TADashboard;