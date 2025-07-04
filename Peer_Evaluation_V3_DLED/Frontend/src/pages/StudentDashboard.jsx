import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from '../components/User/ProfileMenu';
import '../styles/Student/StudentDashboard.css';
import EnrolledCoursesSection from '../components/Student/EnrolledCoursesSection';
import EnrollmentRequestSection from '../components/Student/EnrollmentRequestSection';
import StudentExamsTab from '../components/Student/StudentExamsTab';
import EvaluationsTable from '../components/Student/EvaluationTable';
import TAPanel from '../components/TA/TAPanel';
import { containerStyle, sidebarStyle, mainStyle, contentStyle, sidebarToggleBtnStyle, buttonStyle, sectionHeading } from '../styles/Student/StudentDashboard.js'
import { FaBook, FaClipboardList, FaLaptopCode } from 'react-icons/fa';
import { showMessage } from '../utils/Message';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({ name: '', email: '', role: '', isTA: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taBatchInfo, setTaBatchInfo] = useState(null);
  const [selectedTABatch, setSelectedTABatch] = useState('');
  const [dashboardStats, setDashboardStats] = useState({ courses: 0, pendingEvaluations: 0, activeExams: 0 });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [studentBatches, setStudentBatches] = useState([]);
  const [selectedBatchForExam, setSelectedBatchForExam] = useState('');
  const [batchExams, setBatchExams] = useState([]);
  const [examFileMap, setExamFileMap] = useState({});
  const [selectedExam, setSelectedExam] = useState('');
  const [evaluationExams, setEvaluationExams] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showTAManageOverlay, setShowTAManageOverlay] = useState(false);
  const [manageTAData, setManageTAData] = useState(null);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [flaggedEvaluations, setFlaggedEvaluations] = useState([]);
  const fileInputRefs = useRef({});
  const navigate = useNavigate();

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
    fetchTABatchInfo();
  }, [user.isTA]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  useEffect(() => {
    if (activeTab !== 'home') return;
    fetchDashboardStats();
  }, [activeTab]);

  // Fetch enrolled courses and available courses on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Fetch enrolled courses
    fetch('http://localhost:5000/api/student/enrolled-courses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setEnrolledCourses(Array.isArray(data) ? data : []))
      .catch(() => setEnrolledCourses([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Fetch all available courses
    fetch('http://localhost:5000/api/student/available-courses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAvailableCourses(Array.isArray(data) ? data : []))
      .catch(() => setAvailableCourses([]));
  }, []);

  // Fetch batches for selected course
  useEffect(() => {
    if (!selectedCourse) {
      setAvailableBatches([]);
      setSelectedBatch('');
      return;
    }
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/student/course-batches/${selectedCourse}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAvailableBatches(Array.isArray(data) ? data : []))
      .catch(() => setAvailableBatches([]));
  }, [selectedCourse]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Fetch all batches student is enrolled in
    fetch('http://localhost:5000/api/student/enrolled-batches', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStudentBatches(Array.isArray(data) ? data : []))
      .catch(() => setStudentBatches([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // Fetch all exams for the student (optionally filter by batch)
    let url = 'http://localhost:5000/api/student/all-exams';
    if (selectedBatchForExam) url += `?batchId=${selectedBatchForExam}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setBatchExams(Array.isArray(data) ? data : []))
      .catch(() => setBatchExams([]));
  }, [selectedBatchForExam]);

  useEffect(() => {
    if (activeTab !== 'evaluation') return;
    fetchEvaluations();
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/dashboard-stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (
        typeof data === 'object' &&
        data !== null &&
        'coursesEnrolled' in data &&
        'pendingEvaluations' in data &&
        'activeExams' in data
      ) {
        setDashboardStats({
          courses: data.coursesEnrolled,
          pendingEvaluations: data.pendingEvaluations,
          activeExams: data.activeExams,
        });
      } else {
        console.error('Invalid dashboard stats response:', data);
        setDashboardStats({ courses: 0, pendingEvaluations: 0, activeExams: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setDashboardStats({ courses: 0, pendingEvaluations: 0, activeExams: 0 });
    }
  };

  const fetchTABatchInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user.isTA) return;
    try {
      const res = await fetch('http://localhost:5000/api/ta/my-batches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data) {
        // Ensure taBatchInfo is always an array
        setTaBatchInfo(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Failed to fetch TA batch info:", error);
    }
  };

  const fetchEvaluations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let url = 'http://localhost:5000/api/student/evaluations';

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setEvaluations(data);

        // Extract unique exams from evaluations
        const uniqueExams = data.reduce((acc, evaluation) => {
          if (!acc.some(exam => exam.examId === evaluation.examId)) {
            acc.push({ examId: evaluation.examId, name: evaluation.examName, courseName: evaluation.courseName, batchName: evaluation.batchId });
          }
          return acc;
        }, []);

        setEvaluationExams(uniqueExams);
      } else {
        setEvaluations([]);
        setEvaluationExams([]);
      }
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      setEvaluations([]);
      setEvaluationExams([]);
    }
  };

  const handleEnrollmentRequest = async (e) => {
    e.preventDefault();
    // console.log('Enrollment request:', selectedCourse, selectedBatch);
    if (!selectedCourse || !selectedBatch) {
      showMessage('Please select both course and batch.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/student/request-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: selectedCourse, batchId: selectedBatch }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || 'Failed to send enrollment request.', 'error');
      }
    } catch (error) {
      showMessage('Failed to send enrollment request.', 'error');
    }
    setSelectedCourse('');
    setSelectedBatch('');
  };

  const handleExamFileChange = (examId, file) => {
    setExamFileMap(prev => ({ ...prev, [examId]: file }));
  };

  const handleExamFileUpload = async (examId) => {
    const file = examFileMap[examId];
    if (!file) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('examId', examId);

    try {
      const response = await fetch('http://localhost:5000/api/student/upload-exam-document', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
      }
      else if (response.status === 409) {
        showMessage(data.message, 'info');
      } else {
        showMessage(data.message || 'Upload failed!', 'error');
      }
    } catch {
      showMessage('Upload failed!', 'error');
    }
    setExamFileMap(prev => ({ ...prev, [examId]: null }));
    if (fileInputRefs.current[examId]) {
      fileInputRefs.current[examId].value = "";
    }
  };

  const handleEvaluateClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsOverlayOpen(true);
  };

  const closeEvalOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedEvaluation(null);
  };

  const handleEvaluationSubmit = async (e, selectedEvaluation) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const marks = [];
    const feedback = [];

    Array.from(e.target.elements).forEach((element) => {
      if (element.type === "number" && element.placeholder === "Marks") {
        marks.push(Number(element.value));
      }
      if (element.type === "text" && element.placeholder === "Feedback") {
        feedback.push(element.value);
      }
    });

    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);

    if (totalMarks > selectedEvaluation.examTotalMarks) {
      showMessage(`The total marks ${totalMarks} exceed the allowed maximum ${selectedEvaluation.examTotalMarks} marks. Please check the marks.`, "error");
      return;
    }

    const evaluationData = {
      evaluationId: selectedEvaluation.evaluationId,
      examId: selectedEvaluation?.examId,
      marks,
      feedback,
    };

    try {
      const response = await fetch("http://localhost:5000/api/student/submit-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluationData),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message || "Evaluation submitted successfully!", "success");
        closeEvalOverlay();
        fetchEvaluations();
      } else {
        showMessage(data.message || "Failed to submit evaluation!", "error");
      }
    } catch (error) {
      showMessage("Error submitting evaluation!", "error");
    }
  };

  const handleTAManageClick = async (assignment) => {
    setManageTAData(assignment);
    setShowTAManageOverlay(true);
    // console.log("Assignment clicked:", assignment);
    const enrollmentsData = await fetchTAPendingEnrollments(assignment.batch_id);
    setPendingEnrollments(enrollmentsData);
    // const evaluationsData = await fetchTAFlaggedEvaluations(assignment.batch_id);
    // setFlaggedEvaluations(evaluationsData);
  };

  const closeTAManageOverlay = () => {
    setShowTAManageOverlay(false);
    setManageTAData(null);
    setPendingEnrollments([]);
    setFlaggedEvaluations([]);
  };

  const fetchTAPendingEnrollments = async (batchId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    console.log("Fetching pending enrollments for batch:", batchId);
    try {
      const res = await fetch(
        `http://localhost:5000/api/ta/pending_enrollments/${batchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data) {
        return Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      console.error("Failed to fetch pending enrollments:", error);
    }
    return [];
  };

  const fetchTAFlaggedEvaluations = async (batchId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/ta/evaluations/${batchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data) {
        return Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      console.error("Failed to fetch flagged evaluations:", error);
    }
    return [];
  };

  const acceptEnrollment = async (enrollmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/ta/accept/${enrollmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, "success");
        const updatedEnrollments = await fetchTAPendingEnrollments(manageTAData.batch_id);
        setPendingEnrollments(updatedEnrollments);
      } else {
        showMessage(data.message || "Failed to accept enrollment.", "error");
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const declineEnrollment = async (enrollmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/ta/decline/${enrollmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, "success");
        const updatedEnrollments = await fetchTAPendingEnrollments(manageTAData.batch_id);
        setPendingEnrollments(updatedEnrollments);
      }
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleSidebarToggle = () => setSidebarOpen(open => !open);

  return (
    <div
      className={`student-dashboard-bg${sidebarOpen ? ' sidebar-open' : ''}`}
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
        zIndex: 999,
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
          zIndex: 999,
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
        className={`student-dashboard-sidebar${sidebarOpen ? ' open' : ' collapsed'}`}
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
        <h2 style={{ fontSize: sidebarOpen ? '1.6rem' : '0', fontWeight: 'bold', marginBottom: sidebarOpen ? '1rem' : '0', overflow: 'hidden', whiteSpace: 'nowrap' }}>Student Panel</h2>
        {sidebarOpen && (
          <>
            <button onClick={() => setActiveTab('home')} style={buttonStyle(activeTab === 'home')}>🏠 Home</button>
            <button onClick={() => setActiveTab('course')} style={buttonStyle(activeTab === 'course')}>📚 Courses & Enrollment</button>
            <button onClick={() => setActiveTab('exam')} style={buttonStyle(activeTab === 'exam')}>📋 Exams</button>
            <button onClick={() => setActiveTab('evaluation')} style={buttonStyle(activeTab === 'evaluation')}>📝 Evaluations</button>
            {user.isTA && (
              <button onClick={() => setActiveTab('ta')} style={buttonStyle(activeTab === 'ta')}>🧑‍🏫 TA Panel</button>
            )}
            <button onClick={logout} style={{ marginTop: 'auto', ...buttonStyle(false) }}>🚪 Logout</button>
          </>
        )}
      </div>

      {/* Main Content */}
      <main
        className={`student-dashboard-main${sidebarOpen ? ' sidebar-open' : ''}`}
        style={{
          ...mainStyle,
          marginLeft: 0,
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <div className="student-dashboard-content" style={{
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
          minWidth: '950px',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: ' #4b3c70 transparent',
        }}>
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', color: '#3f3d56' }}>
              <h2 style={{ ...sectionHeading, textAlign: 'center', marginBottom: '2rem' }}>
                Welcome to the Student Dashboard
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                {/* Courses Enrolled Card */}
                <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', color: '#fff' }}>
                  <FaBook size={40} style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Courses Enrolled</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {dashboardStats.courses} </p>
                </div>
                {/* Pending Evaluations Card */}
                <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #32cd32, #125e12)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '230px', color: '#fff' }}>
                  <FaClipboardList size={40} style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pending Evaluations</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {dashboardStats.pendingEvaluations} </p>
                </div>
                {/* Active Exams Card */}
                <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #43cea2, #185a9d)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '200px', color: '#fff' }}>
                  <FaLaptopCode size={40} style={{ marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Active Exams</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {dashboardStats.activeExams} </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: '#2d3559', height: '100%' }}>
              <h2 style={{ ...sectionHeading, marginTop: 0, marginBottom: '2rem', textAlign: 'left' }}>Profile</h2>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}><strong>Name:</strong> {user.name}</p>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}><strong>Email:</strong> {user.email}</p>
              <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
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

          {activeTab === 'course' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#2d3559', width: '100%' }}>
              <h2 style={{ ...sectionHeading, marginTop: 0, marginBottom: '2rem', textAlign: 'center', color: ' #4b3c70', width: '100%' }}>
                Courses & Enrollment
              </h2>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                width: '100%'
              }}>
                {/* Enrolled Courses Section */}
                <EnrolledCoursesSection enrolledCourses={enrolledCourses} />

                {/* Enrollment Request Section */}
                <EnrollmentRequestSection
                  availableCourses={availableCourses}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  availableBatches={availableBatches}
                  selectedBatch={selectedBatch}
                  setSelectedBatch={setSelectedBatch}
                  handleEnrollmentRequest={handleEnrollmentRequest}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'exam' && (
            <StudentExamsTab
              sectionHeading={sectionHeading}
              studentBatches={studentBatches}
              selectedBatchForExam={selectedBatchForExam}
              setSelectedBatchForExam={setSelectedBatchForExam}
              batchExams={batchExams}
              fileInputRefs={fileInputRefs}
              handleExamFileChange={handleExamFileChange}
              handleExamFileUpload={handleExamFileUpload}
              examFileMap={examFileMap}
            />
          )}

          {activeTab === 'evaluation' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#2d3559', width: '100%' }}>
              <h2 style={{ ...sectionHeading, marginTop: 0, marginBottom: '2rem', color: '#3f3d56' }}>Evaluations</h2>
              <EvaluationsTable
                evaluations={evaluations}
                evaluationExams={evaluationExams}
                selectedExam={selectedExam}
                setSelectedExam={setSelectedExam}
                isOverlayOpen={isOverlayOpen}
                selectedEvaluation={selectedEvaluation}
                handleEvaluateClick={handleEvaluateClick}
                closeEvalOverlay={closeEvalOverlay}
                handleEvaluationSubmit={handleEvaluationSubmit}
              />
            </div>
          )}

          {activeTab === 'ta' && user.isTA && (
            <TAPanel
              taBatchInfo={taBatchInfo}
              selectedTABatch={selectedTABatch}
              setSelectedTABatch={setSelectedTABatch}
              sectionHeading={sectionHeading}
              handleTAManageClick={handleTAManageClick}
              showTAManageOverlay={showTAManageOverlay}
              closeTAManageOverlay={closeTAManageOverlay}
              manageTAData={manageTAData}
              pendingEnrollments={pendingEnrollments}
              flaggedEvaluations={flaggedEvaluations}
              acceptEnrollment={acceptEnrollment}
              declineEnrollment={declineEnrollment}
            />
          )}

        </div>
      </main>
    </div>
  );
}