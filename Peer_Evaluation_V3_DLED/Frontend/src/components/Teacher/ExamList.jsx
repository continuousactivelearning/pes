
import React from 'react';
import { FaEdit, FaDownload, FaUpload, FaPaperPlane, FaTrashAlt, FaCheck, FaEye, FaFlag, FaChartBar } from 'react-icons/fa';
import '../../styles/Teacher/ExamList.css';

const ExamList = ({ exams, handleEditClick, handleDownloadPDF, handleBulkUploadClick, handleSendEvaluation, handleFlagEvaluations, handleMarkAsDone, handleDeleteExam, handleViewEvaluations, handleViewResults }) => {
  return (
    <div className="exam-list-container">
      <h3 className="exam-list-title">Exams</h3>
      <div className="exam-list-table-wrapper">
        <table className="exam-list-table">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Batch</th>
              <th>Date</th>
              <th>Time</th>
              <th>No. of questions</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>K</th>
              <th>Total Students</th>
              <th>Total Attendees</th>
              <th>Total Submissions</th>
              <th>Solutions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan="13" style={{ padding: '16px', textAlign: 'center', color: '#3f3d56', fontStyle: 'italic' }}>
                  No exam scheduled yet.
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.name}</td>
                  <td>{exam.batch}</td>
                  <td>
                    {new Date(exam.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td>{exam.time}</td>
                  <td>{exam.number_of_questions}</td>
                  <td>{exam.duration} mins</td>
                  <td>{exam.totalMarks}</td>
                  <td>{exam.k}</td>
                  <td>{exam.studentCount}</td>
                  <td>{exam.total_students}</td>
                  <td>{exam.totalSubmissions}</td>
                  <td style={{ textAlign: 'center' }}>
                    {typeof exam.solutions === 'string' && exam.solutions.trim() !== '' ? (
                      <a href={`http://localhost:5000/${exam.solutions}`} target="_blank" rel="noopener noreferrer">
                        View Solutions
                      </a>
                    ) : (
                      'No Solutions Available'
                    )}
                  </td>
                  <td>
                    <div className="exam-list-actions">
                      {/* Action Buttons */}
                      {!exam.evaluations_sent && (
                        <>
                          <button
                            onClick={() => handleEditClick(exam)}
                            className="exam-action-btn"
                            style={{ border: ' #006400 1px solid' }}
                            title="Edit Exam"
                          >
                            <FaEdit style={{ color: ' #006400', fontSize: '1.2rem' }} />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(exam._id)}
                            className="exam-action-btn"
                            style={{ border: ' #00008b 1px solid' }}
                            title="Download PDF"
                          >
                            <FaDownload style={{ color: ' #00008b', fontSize: '1.2rem' }} />
                          </button>
                          <button
                            onClick={() => handleBulkUploadClick(exam._id)}
                            className="exam-action-btn"
                            style={{ border: ' #6a0dad 1px solid' }}
                            title="Bulk Upload"
                          >
                            <FaUpload style={{ color: ' #6a0dad', fontSize: '1.2rem' }} />
                          </button>
                          <button
                            onClick={() => handleSendEvaluation(exam._id)}
                            className="exam-action-btn"
                            style={{ border: ' #007bff 1px solid' }}
                            title="Send Evaluation"
                          >
                            <FaPaperPlane style={{ color: ' #007bff', fontSize: '1.2rem' }} />
                          </button>
                        </>
                      )}
                      {exam.evaluations_sent && !exam.flags && (
                        <button
                          onClick={() => handleFlagEvaluations(exam._id)}
                          className="exam-action-btn"
                          style={{ border: ' #df610d 1px solid' }}
                          title="Flag Evaluations"
                        >
                          <FaFlag style={{ color: ' #df610d', fontSize: '1.2rem' }} />
                        </button>
                      )}
                      <button
                        onClick={() => handleMarkAsDone(exam._id)}
                        className="exam-action-btn"
                        style={{ border: ' #28a745 1px solid' }}
                        title="Mark as Done"
                      >
                        <FaCheck style={{ color: ' #28a745', fontSize: '1.2rem' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam._id)}
                        className="exam-action-btn"
                        style={{ border: '#c0392b 1px solid' }}
                        title="Delete Exam"
                      >
                        <FaTrashAlt style={{ color: ' #c0392b', fontSize: '1.2rem' }} />
                      </button>
                      {exam.evaluations_sent && (
                        <>
                          <button
                            onClick={() => handleViewEvaluations(exam._id)}
                            className="exam-action-btn"
                            style={{ border: ' #007bff 1px solid' }}
                            title="View Evaluations"
                          >
                            <FaEye style={{ color: ' #007bff', fontSize: '1.2rem' }} />
                          </button>
                          <button
                            onClick={() => handleViewResults(exam._id)}
                            className="exam-action-btn"
                            style={{ border: ' #8e44ad 1px solid' }}
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