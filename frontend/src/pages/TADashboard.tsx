import React, { useEffect, useState, type JSX } from 'react';
import { FiMenu, FiLogOut, FiHome, FiShield, FiDownload, FiEdit, FiSend } from 'react-icons/fi';

const TADashboard = ({ onLogout }: { onLogout?: () => void }) => {
  const [activePage, setActivePage] = useState("home");
  const [showSidebar, setShowSidebar] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  //const [showSettings, setShowSettings] = useState(false);
  const [commentDialog, setCommentDialog] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [comment, setComment] = useState('');
  const [updateMarksDialog, setUpdateMarksDialog] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });
  const [newMarks, setNewMarks] = useState('');

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

  const DialogBox = ({ show, message, children }: { show: boolean, message: string, children?: React.ReactNode }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center min-w-[320px]">
          <div className="mb-2">
            <svg width={56} height={56} fill="none" viewBox="0 0 56 56">
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

  const [flaggedEvaluations, setFlaggedEvaluations] = useState([
    {
      id: 1,
      student: 'Aarav Sharma',
      studentId: 'CS2023123',
      course: 'Data Structures',
      batch: 'Batch-A',
      reason: 'Marks not justified based on answer length.',
      marks: 65
    },
    {
      id: 2,
      student: 'Diya Patel',
      studentId: 'CS2023087',
      course: 'Operating Systems',
      batch: 'Batch-B',
      reason: 'Some answers were not evaluated.',
      marks: 78
    },
    {
      id: 3,
      student: 'Rohan Mehta',
      studentId: 'CS2023176',
      course: 'Algorithms',
      batch: 'Batch-C',
      reason: 'Incorrect deduction in a 10-mark question.',
      marks: 82
    }
  ]);

  const handleTranscriptDownload = (id: number) => {
    alert(`Download transcript for evaluation ${id}`);
  };

  const handleUpdateMarks = (id: number) => {
    const evaluation = flaggedEvaluations.find(ev => ev.id === id);
    if (evaluation) {
      setNewMarks(evaluation.marks.toString());
      setUpdateMarksDialog({ show: true, id });
    }
  };

  const confirmUpdateMarks = () => {
    if (updateMarksDialog.id !== null) {
      const updatedMarks = parseInt(newMarks);
      if (!isNaN(updatedMarks) && updatedMarks >= 0 && updatedMarks <= 100) {
        setFlaggedEvaluations(prev => 
          prev.map(ev => ev.id === updateMarksDialog.id ? {...ev, marks: updatedMarks} : ev)
        );
        alert(`Marks updated for evaluation ${updateMarksDialog.id} to ${updatedMarks}`);
        setUpdateMarksDialog({ show: false, id: null });
        setNewMarks('');
      } else {
        alert("Please enter valid marks between 0 and 100");
      }
    }
  };

  const handleSendToTeacher = (id: number) => {
    setCommentDialog({ show: true, id });
  };

  const confirmSendToTeacher = () => {
    if (commentDialog.id !== null) {
      alert(`Evaluation ${commentDialog.id} sent to teacher with comment: ${comment}`);
      setCommentDialog({ show: false, id: null });
      setComment('');
    }
  };

  const pages: Record<string, JSX.Element> = {
    home: (
      <div className="flex flex-col items-center justify-start w-full h-full pt-10 pb-4">
        <h1 className="text-4xl font-bold text-[#38365e] text-center mb-6">
          Welcome to TA Dashboard
        </h1>
        <div className="mt-10 flex flex-col items-center w-full max-w-2xl">
          <div className="bg-red-100 border border-red-300 rounded-3xl p-8 w-full shadow flex flex-col items-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Flagged Evaluations</h2>
            {flaggedEvaluations.length === 0 ? (
              <p className="text-red-800 text-center mb-2">
                No flagged evaluations at the moment.
              </p>
            ) : (
              <ul className="w-full">
                {flaggedEvaluations.slice(0, 3).map(ev => (
                  <li key={ev.id} className="mb-2 bg-white rounded-xl p-3 shadow text-left">
                    <div className="flex justify-between">
                      <span className="font-semibold">{ev.student}</span>
                      <span className="font-bold text-red-600">Marks: {ev.marks}/100</span>
                    </div>
                    <div>({ev.studentId}) flagged <span className="font-semibold">{ev.course}</span> [{ev.batch}]: {ev.reason}</div>
                  </li>
                ))}
              </ul>
            )}
            {flaggedEvaluations.length > 3 && (
              <button
                className="mt-2 text-blue-700 underline"
                onClick={() => setActivePage('flagged')}
              >
                View All
              </button>
            )}
          </div>
        </div>
      </div>
    ),
    flagged: (
      <div className="flex flex-col items-center justify-start w-full h-full pt-10 pb-4">
        <h2 className="text-3xl font-bold text-red-700 text-center mb-8">Flagged Evaluations</h2>
        <div className="w-full max-w-4xl">
          {flaggedEvaluations.length === 0 ? (
            <p className="text-gray-600 text-center">No flagged evaluations at the moment.</p>
          ) : (
            <ul className="space-y-4">
              {flaggedEvaluations.map(ev => (
                <li key={ev.id} className="bg-red-50 border border-red-200 rounded-xl p-4 shadow">
                  <div className="font-semibold text-md text-gray-800 mb-1 flex justify-between">
                    <span>{ev.student} ({ev.studentId}) from batch <span className="text-purple-700">{ev.batch}</span> in <span className="text-blue-800">{ev.course}</span></span>
                    <span className="text-red-600 font-bold">Current Marks: {ev.marks}/100</span>
                  </div>
                  <div className="text-gray-700 mb-2">Reason: {ev.reason}</div>
                  <div className="flex gap-4">
                    <button onClick={() => handleTranscriptDownload(ev.id)} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <FiDownload /> Download Transcript
                    </button>
                    <button onClick={() => handleUpdateMarks(ev.id)} className="flex items-center gap-2 text-green-600 hover:underline">
                      <FiEdit /> Update Marks
                    </button>
                    <button onClick={() => handleSendToTeacher(ev.id)} className="flex items-center gap-2 text-red-600 hover:underline">
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
            <label className="block text-gray-700 mb-2">Enter new marks (0-100):</label>
            <input 
              type="number" 
              min="0" 
              max="100"
              value={newMarks} 
              onChange={e => setNewMarks(e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-800" 
            />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setUpdateMarksDialog({ show: false, id: null })} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
            <button onClick={confirmUpdateMarks} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Save Changes</button>
          </div>
        </DialogBox>
      </div>
    </div>
  );
};

export default TADashboard;