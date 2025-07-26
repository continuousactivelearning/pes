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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={examHistoryOverlayClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '90vw',
          maxHeight: '80vh',
          width: '800px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            margin: 0,
            color: '#4b3c70',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            Exam History
          </h2>
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
        </div>

        {/* Content */}
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {completedExams.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#666'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ color: '#4b3c70', marginBottom: '0.5rem' }}>No Completed Exams</h3>
              <p>You don't have any completed exams yet.</p>
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(75, 60, 112, 0.1)'
            }}>
              <thead style={{
                backgroundColor: '#4b3c70',
                color: '#ffffff'
              }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Exam Name</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Batch</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Duration</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedExams.map((exam, index) => (
                  <tr key={exam._id} style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.parentNode.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.parentNode.style.background = 'white'}
                  >
                    <td style={{ 
                      padding: '12px', 
                      fontWeight: '500',
                      color: '#2d3559'
                    }}>
                      {exam.name}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: '#2d3559'
                    }}>
                      {exam.batch.course.courseName}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {exam.batch.batchId}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      {formatDate(exam.date)}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      {exam.duration} mins
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        background: '#e8f5e8',
                        color: '#2d5016',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        ✅ Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {/* <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <button
            onClick={examHistoryOverlayClose}
            style={{
              background: '#4b3c70',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3a2d56'}
            onMouseLeave={(e) => e.target.style.background = '#4b3c70'}
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}