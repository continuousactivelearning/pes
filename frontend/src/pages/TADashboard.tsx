import React, { useEffect, useState, type JSX } from 'react';
import { FiMenu, FiLogOut, FiHome, FiShield, FiDownload, FiEdit, FiSend } from 'react-icons/fi';

interface FlaggedEvaluation {
  _id: string;
  evaluation: {
    _id: string;
    evaluatee: {
      name: string;
      email: string;
    };
    evaluator: {
      name: string;
      email: string;
    };
    marks: number[];
    feedback?: string;
    exam: {
      title: string;
    }
  };
  flaggedBy: {
    name: string;
    email: string;
  };
  reason?: string;
  resolutionStatus: 'pending' | 'resolved' | 'escalated';
}

const PORT = import.meta.env.VITE_BACKEND_PORT || 5000;

const TADashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activePage, setActivePage] = useState("home");
  const [showSidebar, setShowSidebar] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [commentDialog, setCommentDialog] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [comment, setComment] = useState('');
  const [updateMarksDialog, setUpdateMarksDialog] = useState<{ 
    show: boolean; 
    id: string | null;
    evaluation?: any;
  }>({ show: false, id: null });
  const [newMarks, setNewMarks] = useState<number[]>([]);
  const [flaggedEvaluations, setFlaggedEvaluations] = useState<FlaggedEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Fetch flagged evaluations from backend
  const fetchFlaggedEvaluations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ta/flagged-evaluations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flagged evaluations');
      }

      const data = await response.json();
      setFlaggedEvaluations(data.flaggedEvaluations || []);
    } catch (err) {
      console.error('Error fetching flagged evaluations:', err);
      setError('Failed to load flagged evaluations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedEvaluations();
  }, [activePage]);

  const handleDownloadTranscript = async (evaluationId: string) => {
    try {
      // Create a download link for the PDF
      const response = await fetch(`http://localhost:${PORT}/api/ta/submission/${evaluationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download submission');
      }
      
      // Convert response to blob
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `submission_${evaluationId}.pdf`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Release the object URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading transcript:', err);
      setError('Failed to download submission. Please try again.');
    }
  };

  const handleUpdateMarks = async (flagId: string) => {
    try {
      const flag = flaggedEvaluations.find(ev => ev._id === flagId);
      if (!flag) return;
      
      // Initialize with current marks
      setNewMarks([...flag.evaluation.marks]);
      setUpdateMarksDialog({ 
        show: true, 
        id: flagId,
        evaluation: flag.evaluation
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
      
      // Validate all marks
      const invalidMarks = newMarks.some(mark => 
        isNaN(mark) || mark < 0 || mark > 20
      );
      
      if (invalidMarks) {
        alert("Please enter valid marks between 0 and 20 for all questions");
        return;
      }

      const response = await fetch(`http://localhost:${PORT}/api/ta/resolve-flag/${updateMarksDialog.id}`, {
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
      
      // Refresh the data
      fetchFlaggedEvaluations();
    } catch (err) {
      console.error('Error updating marks:', err);
      setError('Failed to update marks. Please try again.');
    } finally {
      setLoading(false);
      setUpdateMarksDialog({ show: false, id: null });
      setNewMarks([]);
    }
  };

  const handleSendToTeacher = (flagId: string) => {
    setCommentDialog({ show: true, id: flagId });
  };

  const confirmSendToTeacher = async () => {
    if (!commentDialog.id) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:${PORT}/api/ta/escalate/${commentDialog.id}`, {
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

      setSuccessMessage('Flag escalated to teacher successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the data
      fetchFlaggedEvaluations();
    } catch (err) {
      console.error('Error escalating to teacher:', err);
      setError('Failed to escalate to teacher. Please try again.');
    } finally {
      setLoading(false);
      setCommentDialog({ show: false, id: null });
      setComment('');
    }
  };

  const DialogBox = ({ show, message, children }: { show: boolean, message: string, children?: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center min-w-[320px]">
          <div className="mb-2">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="#6ddf99" />
              <path d="M18 30l7 7 13-13" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-lg text-[#235d3a] font-semibold text-center mb-1">{message}</div>
          {children}
        </div>
      </div>
    );
  };

  const pages: Record<string, JSX.Element> = {
    home: (
      <div className="flex flex-col items-center justify-start w-full h-full pt-10 pb-4">
        <h1 className="text-4xl font-bold text-[#38365e] text-center mb-6">
          Welcome to TA Dashboard
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 w-full max-w-2xl">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 w-full max-w-2xl">
            {successMessage}
          </div>
        )}
        
        <div className="mt-10 flex flex-col items-center w-full max-w-2xl">
          <div className="bg-red-100 border border-red-300 rounded-3xl p-8 w-full shadow flex flex-col items-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Flagged Evaluations</h2>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
              </div>
            ) : flaggedEvaluations.length === 0 ? (
              <p className="text-red-800 text-center mb-2">
                No flagged evaluations at the moment.
              </p>
            ) : (
              <ul className="w-full">
                {flaggedEvaluations.slice(0, 3).map(flag => (
                  <li key={flag._id} className="mb-2 bg-white rounded-xl p-3 shadow text-left">
                    <div className="flex justify-between">
                      <span className="font-semibold">{flag.evaluation.evaluatee.name}</span>
                      <span className="text-red-600 text-sm">{flag.evaluation.exam.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{flag.reason || "No reason provided"}</p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdateMarks(flag._id)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FiEdit size={14} /> Update
                      </button>
                      <button
                        onClick={() => handleSendToTeacher(flag._id)}
                        className="text-sm text-red-600 hover:underline flex items-center gap-1"
                      >
                        <FiSend size={14} /> Escalate
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {flaggedEvaluations.length > 3 && (
              <button
                onClick={() => setActivePage("flagged")}
                className="mt-4 text-red-700 hover:underline"
              >
                View all ({flaggedEvaluations.length})
              </button>
            )}
          </div>
        </div>
      </div>
    ),
    flagged: (
      <div className="flex flex-col items-center justify-start w-full h-full pt-10 pb-4">
        <h2 className="text-3xl font-bold text-red-700 text-center mb-8">Flagged Evaluations</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 w-full max-w-4xl">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 w-full max-w-4xl">
            {successMessage}
          </div>
        )}
        
        <div className="w-full max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
            </div>
          ) : flaggedEvaluations.length === 0 ? (
            <p className="text-gray-600 text-center">No flagged evaluations at the moment.</p>
          ) : (
            <ul className="space-y-4">
              {flaggedEvaluations.map(flag => (
                <li key={flag._id} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Student:</p>
                      <p className="font-semibold">{flag.evaluation.evaluatee.name}</p>
                      <p className="text-sm text-gray-500">{flag.evaluation.evaluatee.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Evaluator:</p>
                      <p className="font-semibold">{flag.evaluation.evaluator.name}</p>
                      <p className="text-sm text-gray-500">{flag.evaluation.evaluator.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Course:</p>
                      <p className="font-semibold">{flag.evaluation.exam.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Marks:</p>
                      <div className="mt-1 grid grid-cols-5 gap-1">
                        {flag.evaluation.marks.map((mark: number, idx: number) => (
                          <div key={idx} className="bg-gray-100 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">Q{idx+1}</div>
                            <div className="font-semibold">{mark}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-right font-semibold">
                        Total: {Math.round(flag.evaluation.marks.reduce((sum: number, mark: number) => sum + mark, 0))}
                        /{flag.evaluation.marks.length * 20}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-600">Flag Reason:</p>
                    <p className="italic bg-red-50 p-3 rounded-lg mt-1">{flag.reason || "No reason provided"}</p>
                  </div>
                  
                  {flag.evaluation.feedback && (
                    <div className="mt-4">
                      <p className="text-gray-600">Feedback:</p>
                      <p className="italic bg-blue-50 p-3 rounded-lg mt-1">{flag.evaluation.feedback}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      onClick={() => handleDownloadTranscript(flag.evaluation._id)}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FiDownload /> Download Submission
                    </button>
                    <button 
                      onClick={() => handleUpdateMarks(flag._id)}
                      className="flex items-center gap-2 text-green-600 hover:underline"
                    >
                      <FiEdit /> Update Marks
                    </button>
                    <button 
                      onClick={() => handleSendToTeacher(flag._id)}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <FiSend /> Send to Teacher
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "linear-gradient(180deg,#ffe3ec 80%,#f0f0f5 100%)" }}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#493a6b] to-[#2D2150] text-white flex flex-col justify-between py-6 px-4 rounded-r-3xl transition-all duration-300`}>
        <button onClick={() => setShowSidebar(!showSidebar)} className="self-start mb-6 p-2 border-2 border-transparent hover:border-blue-300 rounded-full active:scale-95 transition">
          <FiMenu className="text-2xl" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className={`font-bold mb-10 mt-4 transition-all ${showSidebar ? 'text-2xl' : 'text-lg'}`}>{showSidebar ? 'TA Panel' : 'TA'}</h2>
          <ul className="space-y-3 w-full">
            {[
              { key: 'home', label: 'Home', icon: FiHome },
              { key: 'flagged', label: 'Flagged Evaluations', icon: FiShield }
            ].map(({ key, label, icon: Icon }) => (
              <li key={key} onClick={() => setActivePage(key)} className={`cursor-pointer ${activePage === key ? 'bg-[#57418d]' : ''} flex items-center px-4 py-2 rounded transition`}>
                <Icon className={`transition-all ${showSidebar ? 'mr-2 text-xl' : 'text-3xl'}`} />
                {showSidebar && label}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => setLogoutDialog(true)} className="flex items-center justify-center gap-2 hover:text-red-400 transition">
          <FiLogOut className={`${showSidebar ? 'mr-2 text-xl' : 'text-3xl'}`} />
          {showSidebar && 'Logout'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-y-auto flex justify-center items-start">
        <div className="bg-white rounded-3xl shadow-lg w-full h-auto mt-24 mb-8 mx-4 p-0 flex items-start justify-center overflow-auto max-w-6xl"
          style={{ minHeight: "calc(100vh - 120px)", boxShadow: '0 2px 24px 0 rgba(87,65,141,0.10)' }}>
          <div className="w-full">{pages[activePage]}</div>
        </div>

        <DialogBox show={logoutDialog} message="Are you sure you want to logout?">
          <div className="flex gap-8 mt-4">
            <button onClick={() => setLogoutDialog(false)} className="bg-gray-200 text-gray-700 rounded-xl px-8 py-2 font-semibold hover:bg-gray-300 transition">No</button>
            <button onClick={() => { setLogoutDialog(false); onLogout ? onLogout() : window.location.href = "/login"; }} className="bg-red-500 text-white rounded-xl px-8 py-2 font-semibold hover:bg-red-600 transition">Yes</button>
          </div>
        </DialogBox>

        <DialogBox show={commentDialog.show} message="Add a comment before sending">
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your note here..." className="w-full border rounded-lg p-2 text-gray-800 mb-4" rows={3} />
          <div className="flex gap-4">
            <button onClick={() => setCommentDialog({ show: false, id: null })} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
            <button onClick={confirmSendToTeacher} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Send</button>
          </div>
        </DialogBox>
        
        <DialogBox show={updateMarksDialog.show} message="Update evaluation marks">
          <div className="w-full mb-4">
            <div className="text-sm text-gray-500 mb-3">Enter marks for each question (0-20):</div>
            
            {newMarks.map((mark, index) => (
              <div key={index} className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Question {index + 1}:
                </label>
                <input 
                  type="number" 
                  min="0" 
                  max="20"
                  value={mark} 
                  onChange={(e) => handleMarkChange(index, e.target.value)}
                  className="w-full border rounded-lg p-2 text-gray-800" 
                />
              </div>
            ))}
            
            <div className="mt-3 text-right">
              <span className="font-medium">
                Total: {newMarks.reduce((sum, mark) => sum + mark, 0)} 
                / {newMarks.length * 20}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setUpdateMarksDialog({ show: false, id: null })} 
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              onClick={confirmUpdateMarks} 
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </DialogBox>
      </div>
    </div>
  );
};

export default TADashboard;