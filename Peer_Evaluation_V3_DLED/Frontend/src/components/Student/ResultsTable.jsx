import React from "react";
import { FaEye } from "react-icons/fa";

const ResultsTable = ({ 
  resultBatches, 
  selectedResultBatch, 
  setSelectedResultBatch, 
  resultExams, 
  handleViewPeerResults 
}) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#2d3559",
      width: "100%",
    }}>
      {/* Batch Dropdown */}
      {resultBatches.length > 0 ? (
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          width: "100%",
          justifyContent: "center",
        }}>
          <select
            value={selectedResultBatch || ""}
            onChange={(e) => setSelectedResultBatch(e.target.value)}
            style={{
              width: "auto",
              maxWidth: "100%",
              minWidth: 250,
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "1.5px solid #4b3c70",
              fontSize: "1rem",
              background: "#fff",
              color: "#000",
              fontWeight: 500,
              transition: "background 0.2s",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">Select Batch</option>
            {resultBatches.map((batch, idx) => (
              <option key={idx} value={batch.batch_id}>
                {batch.courseName} - {batch.batchId}
              </option>
            ))}
          </select>
        </div>
      ) : (
          <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: "1000px",
        }}>
          <p style={{
            fontSize: "1rem",
            textAlign: "center",
            fontStyle: "italic",
          }}>
            You are not currently enrolled in any courses. Please contact your instructor or administrator for course enrollment to access your exam results.
          </p>
        </div>
      )}

      {/* Exams Table Container with Overflow */}
      {selectedResultBatch && (
        <div style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "60vh", // Limit height to prevent too much vertical scrolling
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(75, 60, 112, 0.1)",
          // Custom scrollbar styles
          scrollbarWidth: "thin",
          scrollbarColor: "#4b3c70 #f0f0f0",
        }}>
          <table style={{
            width: "100%",
            minWidth: "600px",
            borderCollapse: "collapse",
            background: "#fff",
            fontSize: "0.9rem",
          }}>
            <thead style={{
              backgroundColor: "#4b3c70",
              color: "#ffffff",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}>
              <tr>
                <th style={{ 
                  padding: "12px 8px", 
                  textAlign: "center",
                  minWidth: "150px",
                  whiteSpace: "nowrap"
                }}>
                  Exam Name
                </th>
                <th style={{ 
                  padding: "12px 8px", 
                  textAlign: "center",
                  minWidth: "130px",
                  whiteSpace: "nowrap"
                }}>
                  Exam Date
                </th>
                <th style={{ 
                  padding: "12px 8px", 
                  textAlign: "center",
                  minWidth: "100px",
                  whiteSpace: "nowrap"
                }}>
                  Total Marks
                </th>
                <th style={{ 
                  padding: "12px 8px", 
                  textAlign: "center",
                  minWidth: "100px",
                  whiteSpace: "nowrap"
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {resultExams.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{
                    padding: "20px 12px",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "gray",
                  }}>
                    No active exams found for this batch. Please check Exam history in Exam section for completed exams.
                  </td>
                </tr>
              ) : (
                resultExams.map((exam, idx) => (
                  <tr key={idx} style={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:hover": {
                      backgroundColor: "#f8f9fa"
                    }
                  }}>
                    <td style={{ 
                      padding: "12px 8px", 
                      textAlign: "center", 
                      fontWeight: 500,
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      <span title={exam.name}>{exam.name}</span>
                    </td>
                    <td style={{ 
                      padding: "12px 8px", 
                      textAlign: "center", 
                      fontWeight: 500,
                      whiteSpace: "nowrap"
                    }}>
                      {new Date(exam.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ 
                      padding: "12px 8px", 
                      textAlign: "center", 
                      fontWeight: 500 
                    }}>
                      {exam.totalMarks}
                    </td>
                    <td style={{ 
                      padding: "12px 8px", 
                      textAlign: "center" 
                    }}>
                      <button
                        onClick={() => handleViewPeerResults(exam)}
                        style={{
                          background: "#4b3c70",
                          border: "none",
                          color: "#fff",
                          padding: "0.5rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.3rem",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          margin: "0 auto",
                          minWidth: "60px",
                          transition: "background 0.2s",
                          "&:hover": {
                            background: "#3a2d5c"
                          }
                        }}
                        title="View Peer Results"
                      >
                        <FaEye />
                        <span style={{
                          display: window.innerWidth > 768 ? "inline" : "none"
                        }}>
                          View
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom CSS for better scrollbar styling */}
      <style>{`
        .results-table-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .results-table-container::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 4px;
        }
        .results-table-container::-webkit-scrollbar-thumb {
          background: #4b3c70;
          border-radius: 4px;
        }
        .results-table-container::-webkit-scrollbar-thumb:hover {
          background: #3a2d5c;
        }
        .results-table-row:hover {
          background-color: #f8f9fa;
        }
        @media (max-width: 768px) {
          .results-table-container table {
            font-size: 0.8rem !important;
          }
          .results-table-container th, 
          .results-table-container td {
            padding: 8px 4px !important;
          }
          .view-results-btn span {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsTable;