import React from 'react';
import { FaEdit, FaDownload, FaUpload, FaPaperPlane, FaTrashAlt, FaCheck, FaEye, FaFlag, FaChartBar } from 'react-icons/fa';

const ExamList = ({ exams, handleEditClick, handleDownloadPDF, handleBulkUploadClick, handleSendEvaluation, handleFlagEvaluations, handleMarkAsDone, handleDeleteExam, handleViewEvaluations, handleViewResults }) => {
  return (
    <div style={{ marginTop: '2rem', maxHeight: '100vh', border: '2px solid #5c5470', borderRadius: '12px', boxShadow: "0 4px 12px #4b3c70" }}>
      <h3 style={{ color: '#3f3d56', fontWeight: 'bold', marginBottom: '1rem' }}>Exams</h3>
      <div style={{ maxHeight: '30vh', overflowY: 'auto', overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: ' #4b3c70 transparent' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '12px' }}>
          <thead style={{ backgroundColor: '#4b3c70', color: '#ffffff', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'center' }}>Exam Name</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Batch</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Time</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>No. of questions</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Duration</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Total Marks</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>K</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Total Students</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Total Attendees</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Total Submissions</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Solutions</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
                <tr>
                  <td colSpan="13" style={{ padding: '16px', textAlign: 'center', color: '#3f3d56', fontStyle:'italic' }}>
                    No exam scheduled yet.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.name}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.batch}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>
                      {new Date(exam.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.time}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.number_of_questions}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.duration} mins</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.totalMarks}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.k}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.studentCount}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.total_students}</td>
                    <td style={{ padding: '12px', color: '#3f3d56' }}>{exam.totalSubmissions}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {typeof exam.solutions === 'string' && exam.solutions.trim() !== '' ? (
                        <a href={`http://localhost:5000/${exam.solutions}`} target="_blank" rel="noopener noreferrer">
                          View Solutions
                        </a>
                      ) : (
                        'No Solutions Available'
                      )}
                    </td>
                    <td style={{ padding: '12px', overflowX: 'auto' }}>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {!exam.evaluations_sent && (
                          <>
                            <button
                              onClick={() => handleEditClick(exam)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #006400 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="Edit Exam"
                            >
                              <FaEdit style={{ color: ' #006400', fontSize: '1.2rem' }} />
                            </button>

                            <button
                              onClick={() => handleDownloadPDF(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #00008b 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                              title="Download PDF"
                            >
                              <FaDownload style={{ color: ' #00008b', fontSize: '1.2rem' }} />
                            </button>
                            
                            <button
                              onClick={() => handleBulkUploadClick(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #6a0dad 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="Bulk Upload"
                            >
                              <FaUpload style={{ color: ' #6a0dad', fontSize: '1.2rem' }} />
                            </button>

                            <button
                              onClick={() => handleSendEvaluation(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #007bff 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="Send Evaluation"
                            >
                              <FaPaperPlane style={{ color: ' #007bff', fontSize: '1.2rem' }} />
                            </button>

                          </>
                        )}

                        {exam.evaluations_sent && !exam.flags && (
                          <>
                            <button
                              onClick={() => handleFlagEvaluations(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #df610d 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="Flag Evaluations"
                            >
                              <FaFlag style={{ color: ' #df610d', fontSize: '1.2rem' }} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleMarkAsDone(exam._id)}
                          style={{
                            borderRadius: '8px',
                            color: '#ffffff',
                            background: 'none',
                            border: ' #28a745 1px solid',
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Mark as Done"
                        >
                          <FaCheck style={{ color: ' #28a745', fontSize: '1.2rem' }} />
                        </button>

                        <button
                          onClick={() => handleDeleteExam(exam._id)}
                          style={{
                            borderRadius: '8px',
                            color: '#ffffff',
                            background: 'none',
                            border: '#c0392b 1px solid',
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                          title="Delete Exam"
                        >
                          <FaTrashAlt style={{ color: ' #c0392b', fontSize: '1.2rem' }} />
                        </button>

                        { exam.evaluations_sent && (
                          <>
                            <button
                              onClick={() => handleViewEvaluations(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #007bff 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="View Evaluations"
                            >
                              <FaEye style={{ color: ' #007bff', fontSize: '1.2rem' }} />
                            </button>

                            <button
                              onClick={() => handleViewResults(exam._id)}
                              style={{
                                borderRadius: '8px',
                                color: '#ffffff',
                                background: 'none',
                                border: ' #8e44ad 1px solid',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                              title="View Results"
                            >
                              <FaChartBar style={{ color: ' #8e44ad', fontSize: '1.2rem' }} />
                            </button>                            
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamList;