import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Teacher/TeacherDashboard.css'; // Assuming you have a CSS file for styles
import { containerStyle, sidebarStyle, mainStyle, contentStyle, sidebarToggleBtnStyle, buttonStyle, sectionHeading } from '../styles/Teacher/TeacherDashboard.js'; // Importing styles from JS file
import { showMessage } from '../utils/Message'; // Assuming you have a utility for showing messages
import { AppContext } from '../utils/AppContext';
import { useContext } from 'react';
import ProfileMenu from '../components/User/ProfileMenu.jsx';
import ScheduleExamOverlay from '../components/Teacher/ScheduleExamOverlay.jsx';
import EnrollStudentsOverlay from '../components/Teacher/EnrollStudentsOverlay.jsx';
import EditExamOverlay from '../components/Teacher/EditExamOverlay.jsx';
import ExamList from '../components/Teacher/ExamList.jsx';
import { showSendEvaluationDialog, showFlagEvaluationsDialog, showMarkAsDoneDialog, showDeleteExamDialog } from '../components/Teacher/messageDialogs.jsx';
import BulkUploadOverlay from '../components/Teacher/BulkUploadOverlay.jsx';
import FlaggedEvaluationsOverlay from '../components/Teacher/FlaggedEvaluationsOverlay.jsx';
import TeacherEditEvalOverlay from '../components/Teacher/TeacherEditEvalOverlay.jsx';
import ResultsOverlay from '../components/Teacher/ResultsOverlay.jsx';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coursesAndBatches, setCoursesAndBatches] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [examOverlayOpen, setExamOverlayOpen] = useState(false);
  const [enrollOverlayOpen, setEnrollOverlayOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const [isEditExamOverlayOpen, setEditExamOverlayOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [bulkUploadOverlayOpen, setBulkUploadOverlayOpen] = useState(false);
  const [selectedExamForBulkUpload, setSelectedExamForBulkUpload] = useState(null);
  const [flaggedEvaluationsOverlayOpen, setFlaggedEvaluationsOverlayOpen] = useState(false);
  const [flaggedEvaluationsForOverlay, setFlaggedEvaluationsForOverlay] = useState([]);
  const [editEvaluationOverlayOpen, setEditEvaluationOverlayOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [resultsOverlayOpen, setResultsOverlayOpen] = useState(false);
  const [selectedExamForResults, setSelectedExamForResults] = useState(null);
  const { setRefreshApp } = useContext(AppContext);

  useEffect(() => {
    // Remove body background, handled by container now
    document.body.style.background = '';
    document.body.style.margin = '0';
    document.body.style.minHeight = '100vh';
    return () => {
      document.body.style.margin = '';
      document.body.style.minHeight = '';
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    fetch('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?._id) setUser(data);
        else navigate('/login');
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    const fetchCoursesAndBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/teacher/teacher-courses-batches', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Ensure the response is an array before setting state
        if (Array.isArray(data)) {
          setCoursesAndBatches(data);
        } else {
          console.error('Invalid response format:', data);
          setCoursesAndBatches([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Failed to fetch courses and batches:', error);
        setCoursesAndBatches([]); // Fallback to empty array
      }
    };

    fetchCoursesAndBatches();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = coursesAndBatches.find(
        (course) => course.id === selectedCourseId
      );
      const batches = selectedCourse ? selectedCourse.batches : [];
      setFilteredBatches(batches);
      setSelectedBatchId(""); // Reset batch selection when course changes
    } else {
      setFilteredBatches([]);
      setSelectedBatchId("");
    }
  }, [selectedCourseId, coursesAndBatches]);

  // Fetch exams whenever the active tab is 'exam'
  useEffect(() => {
    if (activeTab === 'exam') {
      const fetchExams = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/teacher/teacher-exams', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (Array.isArray(data.exams)) {
            setExams(data.exams);
          } else {
            console.error('Invalid response format for exams:', data);
            setExams([]);
          }
        } catch (error) {
          console.error('Failed to fetch exams:', error);
          setExams([]);
        }
      };

      fetchExams();
    }
  }, [activeTab]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const refreshExamsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/teacher/teacher-exams', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data.exams)) {
        setExams(data.exams);
      }
    } catch (error) {
      console.error('Error refreshing exams list:', error);
      // Optionally handle error
    }
  };

  const handleSidebarToggle = () => setSidebarOpen(open => !open);

  const handleTAAssignment = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const batchId = e.target.batch.value;
    const action = e.target.action.value;

    if (!email || !batchId || !action) {
      showMessage('Please fill all fields.', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/${action}-ta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, batchId }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        e.target.reset();
      } else {
        showMessage(data.message || 'Failed to perform action.', 'error');
      }
    } catch (error) {
      showMessage('An error occurred.', 'error');
      console.error(error);
    }
  };

  const handleScheduleExam = () => {
    setExamOverlayOpen(true);
  };

  const handleExamOverlayClose = () => {
    setExamOverlayOpen(false);
  };

  const handleBulkUploadClick = (examId) => {
    setSelectedExamForBulkUpload(examId);
    setBulkUploadOverlayOpen(true);
  };

  const handleBulkUploadOverlayClose = () => {
    setBulkUploadOverlayOpen(false);
    setSelectedExamForBulkUpload(null);
  };

  const handleEnrollStudents = async ({ csvFile, course, batch }) => {
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('course', course.id);
    formData.append('batch', batch.id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/teacher/students-enroll', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showMessage(`Success: ${data.message} with ${data.statistics.enrolled} already enrolled, ${data.statistics.new_enrollment} new enrollments and ${data.statistics.pending_enrollment} pending requests accepted.`, 'success');
      } else if (response.status === 409) {
        const errorData = await response.json();
        showMessage(`Info: ${errorData.message}`, 'info'); // Display informational message
      } else {
        const errorData = await response.json();
        showMessage(`Error!  ${errorData.message}`, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while enrolling students.', 'error');
      console.error(error);
    }

    setEnrollOverlayOpen(false);
  };

  const downloadEnrolledStudents = async (courseId, batchId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teacher/enrolled-students?courseId=${courseId}&batchId=${batchId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_${batchId}_${courseId}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        showMessage(`Error! ${errorData.message}`, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while downloading the student list.', 'error');
      console.error(error);
    }
  };

  const handleExamSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('batch', formData.batch);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('number_of_questions', formData.number_of_questions);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('totalMarks', formData.totalMarks);
      formDataToSend.append('k', formData.k);
      if (formData.solutions) {
        formDataToSend.append('solutions', formData.solutions);
      }
      const response = await fetch('http://localhost:5000/api/teacher/exam-schedule', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        showMessage(data.message, 'success');
      } else {
        const errorData = await response.json();
        showMessage(errorData.message, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while scheduling the exam.', 'error');
      console.error(error);
    }

    setExamOverlayOpen(false);
    setSelectedCourseId('');
    await refreshExamsList();
  };

  const handleEditClick = (exam) => {
    if (!isEditExamOverlayOpen) {
      setSelectedExam(exam);
      setEditExamOverlayOpen(true);
    }
  };

  const handleEditExamOverlayClose = () => {
    setEditExamOverlayOpen(false);
    setSelectedExam(null);
  };

  const handleEditExamOverlaySubmit = async (updatedExam) => {
    try {
      const token = localStorage.getItem('token');
      const editFormDataToSend = new FormData();
      editFormDataToSend.append('name', updatedExam.name);
      editFormDataToSend.append('date', updatedExam.date);
      editFormDataToSend.append('time', updatedExam.time);
      editFormDataToSend.append('number_of_questions', updatedExam.number_of_questions);
      editFormDataToSend.append('duration', updatedExam.duration);
      editFormDataToSend.append('totalMarks', updatedExam.totalMarks);
      editFormDataToSend.append('k', updatedExam.k);
      editFormDataToSend.append('total_students', updatedExam.total_students || 0);
      if (updatedExam.solutions) {
        editFormDataToSend.append('solutions', updatedExam.solutions);
      }
      const response = await fetch(`http://localhost:5000/api/teacher/update-exam/${updatedExam._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: editFormDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('Exam updated successfully!', 'success');
        // setExams((prevExams) =>
        //   prevExams.map((exam) => (exam.id === updatedExam.id ? { ...exam, ...updatedExam } : exam))
        // );
      } else {
        const errorData = await response.json();
        showMessage(`Error! ${errorData.message || 'Failed to update exam.'}`, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while updating the exam.', 'error');
      console.error(error);
    }

    setEditExamOverlayOpen(false);
    setSelectedExam(null);
    await refreshExamsList();
  };

  const handleDownloadPDF = async (examId) => {
    try {
      const token = localStorage.getItem('token'); 

      const response = await fetch(`http://localhost:5000/api/teacher/download-pdf/${examId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const blob = await response.blob(); // 
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Exam_${examId}_QR_Codes.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorText = await response.text(); 
        console.error('Failed to download PDF:', errorText);
        showMessage(`Failed to download PDF: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showMessage(`Error downloading PDF: ${error.message}`, 'error');
    }
  };

  const handleBulkUpload = async (files) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    formData.append('examId', selectedExamForBulkUpload);

    try {
      const response = await fetch('http://localhost:5000/api/teacher/bulk-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Bulk upload successful: ${result.message}. Successfully uploaded ${result.added} files and updated ${result.updated} files.`, 'success');
      } else {
        const errorData = await response.json();
        showMessage(`Bulk upload failed: ${errorData.message}`, 'error');
      }
    } catch (error) {
      showMessage(`An error occurred during bulk upload: ${error.message}`, 'error');
    }
    setBulkUploadOverlayOpen(false);
    setSelectedExamForBulkUpload(null);
  };

  const handleSendEvaluation = async (examId) => {
    const confirmSend = await showSendEvaluationDialog();
    if (!confirmSend) return;
    
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/teacher/send-evaluation/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Sending evaluation for exam ID: ${examId}`);
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        await refreshExamsList();
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while sending the evaluation.', 'error');
    }
  };

  // Implement the logic to flag evaluations here
  const handleFlagEvaluations = async (examId) => {
    const confirmFlag = await showFlagEvaluationsDialog();
    if (!confirmFlag) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/flag-evaluations/${examId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        await refreshExamsList();
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while flagging evaluations.', 'error');
    }
  };

  const handleMarkAsDone = async (examId) => {
    const confirmMark = await showMarkAsDoneDialog();
    if (!confirmMark) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/mark-exam-done/${examId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Remove the exam from the list in state
        setExams(prev => prev.filter(exam => exam._id !== examId));
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (err) {
      showMessage('Failed to mark exam as done!', 'error');
    }
  };

  const handleDeleteExam = async (examId) => {
    const confirmDelete = await showDeleteExamDialog();

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teacher/delete-exam/${examId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showMessage('Exam deleted successfully!', 'success');
        setExams(exams.filter(exam => exam._id !== examId)); // Remove the deleted exam from the state
      } else {
        const errorData = await response.json();
        showMessage(`Error! ${errorData.message}`, 'error');
      }
    } catch (error) {
      showMessage('An error occurred while deleting the exam.', 'error');
      console.error(error);
    }
  };

  const handleViewEvaluations = async (examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teacher/flagged-evaluations/${examId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setFlaggedEvaluationsForOverlay(data);
        setFlaggedEvaluationsOverlayOpen(true);
      } else {
        showMessage('No evaluations found!', 'info');
      }
    } catch (error) {
      showMessage('Failed to fetch flagged evaluations.', 'error');
    }
  };

  const handleEditEvaluationOverlayOpen = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setEditEvaluationOverlayOpen(true);
  };

  const handleEditEvaluationOverlayClose = () => {
    setEditEvaluationOverlayOpen(false);
    setSelectedEvaluation(null);
  };

  const handleEvaluationUpdate = async (updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teacher/update-evaluation/${updateData.evaluationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            score: updateData.score,
            feedback: updateData.feedback,
            ticket: updateData.ticket || 0,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        handleEditEvaluationOverlayClose();
        handleViewEvaluations(updateData.exam);
      } else {
        showMessage(data.message || 'Failed to update evaluation.', 'error');
      }
    } catch (error) {
      showMessage(error.message || 'An error occurred while updating evaluation!', 'error');
    }
  };

  const handleEvaluationFlagRemove = async (evaluation, examId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/teacher/remove-ticket/${evaluation}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        handleViewEvaluations(examId);
      } else {
        showMessage(data.message || 'Failed to remove flag from evaluation.', 'error');
      }
    } catch (error) {
      showMessage('An error occurred while removing flag from evaluation.', 'error');
    }
  };

  const handleViewResults = async (examId) => {
    setSelectedExamForResults(examId);
    setResultsOverlayOpen(true);
    // try {
    //   const token = localStorage.getItem('token');
    //   const response = await fetch(`http://localhost:5000/api/teacher/view-results/${examId}`, {
    //     method: 'GET',
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setResults(data);
    //     setResultsOverlayOpen(true);
    //   } else {
    //     showMessage(data.message || 'Failed to fetch results.', 'error');
    //   }
    // } catch (error) {
    //   showMessage('An error occurred while fetching results!', 'error');
    // }
  };

  return (
    <div
      className={`teacher-dashboard-bg${sidebarOpen ? ' sidebar-open' : ''}`}
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #ece9f7 0%, #c3cfe2 100%)',
        display: 'flex',
        flexDirection: 'row',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxSizing: 'border-box',
        minWidth: '500px',
        overflowX: 'auto',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: ' #4b3c70 transparent',
      }}
    >
      {/* Profile Icon Dropdown Top Right */}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 36,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
      }}>
        <ProfileMenu user={user} onLogout={logout} onProfile={() => setActiveTab('profile')} />
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1100,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          alignItems: 'center',
        }}
        onClick={handleSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <span style={{ width: '30px', height: '3px', background: 'white', borderRadius: '2px' }}></span>
        <span style={{ width: '30px', height: '3px', background: 'white', borderRadius: '2px' }}></span>
        <span style={{ width: '30px', height: '3px', background: 'white', borderRadius: '2px' }}></span>
      </button>

      {/* Sidebar (collapsible) */}
      <div
        className={`teacher-dashboard-sidebar${sidebarOpen ? ' open' : ' collapsed'}`}
        style={{
          ...sidebarStyle,
          position: 'relative',
          height: 'auto',
          minHeight: '100vh',
          zIndex: 1,
          width: sidebarOpen ? '250px' : '60px',
          transition: 'width 0.3s ease',
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <h2 style={{ fontSize: sidebarOpen ? '1.6rem' : '0', fontWeight: 'bold', marginBottom: sidebarOpen ? '1rem' : '0', overflow: 'hidden', whiteSpace: 'nowrap' }}>Teacher Panel</h2>
        {sidebarOpen && (
          <>
            <button onClick={() => setActiveTab('home')} style={buttonStyle(activeTab === 'home')}>🏠 Home</button>
            <button onClick={() => setActiveTab('role')} style={buttonStyle(activeTab === 'role')}>🧑‍💼 TA Manager</button>
            <button onClick={() => setActiveTab('course')} style={buttonStyle(activeTab === 'course')}>📚 Courses</button>
            <button onClick={() => setActiveTab('exam')} style={buttonStyle(activeTab === 'exam')}>📝 Exams</button>
            <button onClick={logout} style={{ marginTop: 'auto', ...buttonStyle(false) }}>🚪 Logout</button>
          </>
        )}
      </div>

      {/* Main Content */}
      <main
        className={`teacher-dashboard-main${sidebarOpen ? ' sidebar-open' : ''}`}
        style={{
          ...mainStyle,
          marginLeft: 0,
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <div className="teacher-dashboard-content" style={{
          ...contentStyle,
          background: 'rgba(255,255,255,0.92)', // subtle card background
          boxShadow: '0 8px 32px rgba(60,60,120,0.18)', // slightly stronger shadow
          border: '1.5px solid #e3e6f0', // soft border for contrast
          maxWidth: 'none',
          width: '100%',
          height: '80vh',
          minHeight: '500px',
          margin: 'auto',
          display: 'block',
          padding: '3rem 4rem',
          minWidth: '940px',
        }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#3f3d56' }}>
              <h2 style={{ ...sectionHeading, marginBottom: '2rem' }}>Welcome to the Teacher Dashboard</h2>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: '#2d3559', height: '100%' }}>
              <h2 style={{ ...sectionHeading, marginTop: 0, marginBottom: '2rem', textAlign: 'left', color: '#3f3d56' }}>Profile</h2>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: '#3f3d56' }}><strong>Name:</strong> {user.name}</p>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: '#3f3d56' }}><strong>Email:</strong> {user.email}</p>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: '#3f3d56' }}>
                <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <div style={{ marginTop: 'auto' }}>
                <button
                  onClick={() => navigate('/change-password')}
                  style={{
                    background: ' #5c5470',
                    // background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(60,60,120,0.12)',
                    transition: 'background 0.2s',
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'role' && (
            <div style={{ display: 'flex', flexDirection: 'column', color: '#2d3559' }}>
              <h2 style={{ ...sectionHeading, marginTop: 0, marginBottom: '2rem', textAlign: 'center', color: '#3f3d56' }}>TA Manager</h2>
              <p style={{ textAlign: 'left', color: '#3f3d56' }}>Assign or deassign a TA to/from a batch by selecting the batch and action.</p>
              <form onSubmit={handleTAAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                {/* Email Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }} htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter TA email ID"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #5c5470',
                      fontSize: '1rem',
                      width: '300px',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: ' #4b3c70',
                    }}
                  />
                </div>

                {/* Batch Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }} htmlFor="batch">Select Batch</label>
                  <select
                    id="batch"
                    name="batch"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #5c5470',
                      fontSize: '1rem',
                      width: '300px',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: ' #4b3c70',
                    }}
                  >
                    <option value="">Select Batch</option>
                    {coursesAndBatches.flatMap(course =>
                      course.batches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {course.name} ({batch.name})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Action Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                  <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap', width: '150px', textAlign: 'left' }} htmlFor="action">Select Action</label>
                  <select
                    id="action"
                    name="action"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #5c5470',
                      fontSize: '1rem',
                      width: '300px',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                      color: ' #4b3c70',
                    }}
                  >
                    <option value="assign">Assign</option>
                    <option value="deassign">Deassign</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', width: '100%', marginLeft: '150px' }}>
                  <button
                    type="submit"
                    style={{
                      background: '#5c5470',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(60,60,120,0.12)',
                      transition: 'background 0.2s',
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'course' && (
            <div style={{ display: 'flex', flexDirection: 'column', color: '#2d3559', width: '100%' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', color: '#3f3d56' }}>
                Courses and Batches
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#4b3c70', color: '#ffffff' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Course Name</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Batch Name</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesAndBatches.map((course) =>
                    course.batches.map((batch) => (
                      <tr key={batch.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px', color: '#3f3d56' }}>{course.name}</td>
                        <td style={{ padding: '12px', color: '#3f3d56' }}>{batch.name}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => {
                                setSelectedCourse(course);  // or course if you want full object
                                setSelectedBatch(batch);
                                setEnrollOverlayOpen(true);
                              }}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: '#4b3c70',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                            >
                              Enroll Students
                            </button>
                            <button
                              onClick={() => downloadEnrolledStudents(course.id, batch.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: '#4b3c70',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                            >
                              Download List
                            </button>
                          </div>
                          
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'exam' && (
            <div style={{ display: 'flex', flexDirection: 'column', color: '#2d3559', width: '100%' }}>
              <h2 style={{ ...sectionHeading, marginBottom: '2rem', textAlign: 'center', color: '#3f3d56' }}>
                Exam Management
              </h2>

              {/* Inline Row for Course, Batch Dropdowns, and Schedule Exam Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                {/* Course Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
                  <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap' }} htmlFor="courseDropdown">Course</label>
                  <select
                    id="courseDropdown"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #5c5470',
                      fontSize: '1rem',
                      width: '250px',
                      background: '#ffffff',
                      color: '#4b3c70',
                    }}
                  >
                    <option value="">Select Course</option>
                    {coursesAndBatches.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                {/* Batch Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
                  <label style={{ color: '#3f3d56', fontWeight: 'bold', whiteSpace: 'nowrap' }} htmlFor="batchDropdown">Batch</label>
                  <select
                    id="batchDropdown"
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    disabled={filteredBatches.length === 0}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #5c5470',
                      fontSize: '1rem',
                      width: '250px',
                      background: filteredBatches.length > 0 ? '#ffffff' : '#f0f0f0',
                      color: filteredBatches.length > 0 ? '#4b3c70' : '#a0a0a0',
                    }}
                  >
                    <option value="">{filteredBatches.length > 0 ? 'Select Batch' : 'No Batches Available'}</option>
                    {filteredBatches.map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>

                {/* Schedule Exam Button */}
                <button
                  onClick={handleScheduleExam}
                  disabled={!selectedCourseId || !selectedBatchId} // Button is disabled if either course or batch is not selected
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '12px',
                    backgroundColor: selectedCourseId && selectedBatchId ? '#4b3c70' : '#a0a0a0', // Change color based on enabled/disabled state
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: selectedCourseId && selectedBatchId ? 'pointer' : 'not-allowed', // Change cursor based on enabled/disabled state
                  }}
                >
                  Schedule Exam
                </button>
              </div>

              {/* List of Exams */}
              <ExamList 
                exams={exams} 
                handleEditClick={handleEditClick} 
                handleDownloadPDF={handleDownloadPDF} 
                handleBulkUploadClick={handleBulkUploadClick} 
                handleSendEvaluation={handleSendEvaluation}
                handleFlagEvaluations={handleFlagEvaluations}
                handleMarkAsDone={handleMarkAsDone}
                handleDeleteExam={handleDeleteExam}
                handleViewEvaluations={handleViewEvaluations}
                handleViewResults={handleViewResults}
              />
            </div>
          )}
          
        </div>
      </main>

      {/* Schedule Exam Overlay */}
      <ScheduleExamOverlay
        isOpen={examOverlayOpen}
        onClose={handleExamOverlayClose}
        onSubmit={handleExamSubmit}
        batch={selectedBatchId}
      />

      {/* Enroll Students Overlay */}
      <EnrollStudentsOverlay
        isOpen={enrollOverlayOpen}
        onClose={() => setEnrollOverlayOpen(false)}
        onSubmit={handleEnrollStudents}
        course={selectedCourse}
        batch={selectedBatch}
        closeOnOutsideClick={true}
      />

      {/* EditExamOverlay */}
      {isEditExamOverlayOpen && selectedExam && (
        <EditExamOverlay
          isOpen={isEditExamOverlayOpen}
          exam={selectedExam}
          onClose={handleEditExamOverlayClose}
          onSubmit={handleEditExamOverlaySubmit}
        />
      )}

      {bulkUploadOverlayOpen && (
        <BulkUploadOverlay
          examId={selectedExamForBulkUpload} 
          onClose={handleBulkUploadOverlayClose} 
          onUpload={handleBulkUpload} 
        />
      )}

      {flaggedEvaluationsOverlayOpen && (
        <FlaggedEvaluationsOverlay
          flaggedEvaluationsOverlayOpen={flaggedEvaluationsOverlayOpen}
          flaggedEvaluationsOverlayClose={() => setFlaggedEvaluationsOverlayOpen(false)}
          flaggedEvaluations={flaggedEvaluationsForOverlay}
          handleEditEvaluationOverlayOpen={handleEditEvaluationOverlayOpen}
          handleEvaluationFlagRemove={handleEvaluationFlagRemove}
        />
      )}

      {editEvaluationOverlayOpen && selectedEvaluation && (
        <TeacherEditEvalOverlay
          isEditOverlayOpen={editEvaluationOverlayOpen}
          selectedEvaluation={selectedEvaluation}
          closeEditOverlay={handleEditEvaluationOverlayClose}
          handleEvaluationUpdate={handleEvaluationUpdate}
        />
      )}

      {resultsOverlayOpen && selectedExamForResults && (
        <ResultsOverlay
          resultsOverlayOpen={resultsOverlayOpen}
          selectedExamForResults={selectedExamForResults}
          resultsOverlayClose={() => setResultsOverlayOpen(false)}
        />
      )}

    </div>
  );
}
