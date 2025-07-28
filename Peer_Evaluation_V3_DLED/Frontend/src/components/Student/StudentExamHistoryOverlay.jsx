import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function StudentExamHistoryOverlay({
  examHistoryOverlayOpen,
  examHistoryOverlayClose,
  completedExams,
}) {
  if (!examHistoryOverlayOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={examHistoryOverlayClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        color: "#4b3c70",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1001,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          width: "90%",
          maxWidth: "1000px",
          height: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={examHistoryOverlayClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "#fc1717",
            color: "#fff",
            fontWeight: 200,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <FaTimes style={{ fontSize: "1rem" }} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ 
            textAlign: "center", 
            flex: 1, 
            margin: 0,
            color: '#4b3c70',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            Exam History
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "85%",
            width: "100%",
            position: "relative",
          }}
        >
          {completedExams.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666"
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ color: '#4b3c70', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                No Completed Exams
              </h3>
              <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
                You don't have any completed exams yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "0.5rem",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
              }}
            >
              <table style={{
                width: "100%",
                minWidth: "800px",
                borderCollapse: "collapse",
                background: "#fff",
                fontSize: "0.9rem",
                tableLayout: "auto",
              }}>
                <thead style={{
                  backgroundColor: "#4b3c70",
                  color: "#ffffff",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}>
                  <tr>
                    <th style={{ ...thCellStyle }}>Exam Name</th>
                    <th style={{ ...thCellStyle }}>Course</th>
                    <th style={{ ...thCellStyle }}>Batch</th>
                    <th style={{ ...thCellStyle }}>Date</th>
                    <th style={{ ...thCellStyle }}>Total Marks</th>
                    <th style={{ ...thCellStyle }}>Duration</th>
                    <th style={{ ...thCellStyle }}>Status</th>
                    <th style={{ ...thCellStyle }}>Scored Marks</th>
                    <th style={{ ...thCellStyle }}>Score(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {completedExams.map((exam, index) => (
                    <tr 
                      key={exam._id} 
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ ...tdCellStyle }}>
                        {exam.name}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.batch?.course?.courseName || 'Unknown Course'}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.batch?.batchId || 'Unknown Batch'}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {formatDate(exam.date)}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.totalMarks || 0}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.duration} mins
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        <span style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: "15px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          backgroundColor: exam.completed ? '#d4edda' : '#f8d7da',
                          color: exam.completed ? '#155724' : '#721c24',
                        }}>
                          {exam.completed ? 'Completed' : 'Not Completed'}
                        </span>
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.aggregateMarks || 0}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {exam.percentage || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {completedExams.length > 0 && (
            <div
              style={{
                padding: "1rem",
                marginTop: "1rem",
                borderTop: "1px solid #ddd",
                background: "#fff",
                position: "relative",
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ fontWeight: "bold", color: "#4b3c70" }}>
                  Total Completed Exams: {completedExams.length}
                </label>
              </div>

              <div style={{ flex: 1, textAlign: "center" }}>
                <label style={{ fontWeight: "bold", color: "#4b3c70" }}>
                </label>
              </div>

              <div style={{ flex: 1, textAlign: "right" }}>
                <label style={{ fontWeight: "bold", color: "#4b3c70" }}>
                  Latest: {completedExams.length > 0 ? formatDate(completedExams[0].date) : 'N/A'}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const thCellStyle = {
  padding: "12px 8px", 
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1rem"
};

const tdCellStyle = {
  padding: "12px 8px", 
  textAlign: "center", 
  fontWeight: 500,
  color: "#4b3c70"
};