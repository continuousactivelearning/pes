import React from "react";
import { showRaiseTicketDialog } from "./messageDialogs";
import { FaTimes, FaFileAlt, FaExclamationTriangle } from "react-icons/fa";

const PeerResultOverlay = ({ 
  isPeerResultOverlayOpen, 
  closePeerResultOverlay, 
  selectedExamForPeerResult, 
  peerResultsForExam,
  loadingTickets,
  setLoadingTickets,
  handleRaiseTicket
}) => {
  if (!isPeerResultOverlayOpen) return null;

  const calculateAverageScore = () => {
    const completedEvaluations = peerResultsForExam.filter(
      result => result.eval_status === 'completed'
    );
    
    if (completedEvaluations.length === 0) return 0;
    
    const totalScore = completedEvaluations.reduce((sum, result) => {
      const score = Array.isArray(result.score) 
        ? result.score.reduce((scoreSum, current) => scoreSum + current, 0)
        : result.score || 0;
      return sum + score;
    }, 0);
    
    return (totalScore / completedEvaluations.length).toFixed(2);
  };

  const getDocumentUrl = () => {
    if (peerResultsForExam.length > 0 && peerResultsForExam[0].document) {
      const doc = peerResultsForExam[0].document;
      // Adjust this URL based on your backend setup
      return `http://localhost:5000/${doc.documentPath}`;
    }
    return null;
  };

  const documentUrl = getDocumentUrl();

  const handleViewDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const handleRaiseTicketClick = async (evaluationId) => {
    const confirmRaise = await showRaiseTicketDialog();
    
    if (!confirmRaise) return;

    setLoadingTickets(prev => ({ ...prev, [evaluationId]: true }));
    
    try {
      await handleRaiseTicket(evaluationId);
    } catch (error) {
      console.error('Error in raise ticket:', error);
    } finally {
      setLoadingTickets(prev => ({ ...prev, [evaluationId]: false }));
    }
  };

  return (
    <div
      onClick={closePeerResultOverlay}
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
          maxWidth: "1200px",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={closePeerResultOverlay}
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

        <button
            onClick={handleViewDocument}
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#4b3c70",
              border: "none",
              color: "#fff",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "background 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => e.target.style.background = "#3a2d5c"}
            onMouseLeave={(e) => e.target.style.background = "#4b3c70"}
            title="View Your Submitted File"
          >
            <FaFileAlt style={{ fontSize: "1.1rem" }} />
            View Document
          </button>

        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2rem",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ textAlign: "center", flex: 1, margin: 0 }}>
            Results - {selectedExamForPeerResult?.name}
          </h2>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "90%",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Table Container with Scroll */}
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
                  <th style={{ ...thCellStyle }}>
                    Student
                  </th>
                  <th style={{ ...thCellStyle }}>
                    Question-wise Score
                  </th>
                  <th style={{ ...thCellStyle }}>
                    Feedback
                  </th>
                  <th style={{ ...thCellStyle }}>
                    Status
                  </th>
                  <th style={{ ...thCellStyle }}>
                    Total Score
                  </th>
                  <th style={{ ...thCellStyle }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {peerResultsForExam.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{
                      padding: "20px 12px",
                      textAlign: "center",
                      fontWeight: 500,
                      color: "gray",
                      fontSize: "1rem",
                    }}>
                      No peer results found for this exam.
                    </td>
                  </tr>
                ) : (
                  peerResultsForExam.map((result, idx) => (
                    <tr 
                      key={idx}
                      style={{
                        borderBottom: "1px solid #e0e0e0",
                        "&:hover": {
                          backgroundColor: "#f8f9fa"
                        }
                      }}
                    >
                      <td style={{ ...tdCellStyle }}>
                        {result.student.name || 'Unknown'}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {Array.isArray(result.score) 
                          ? result.score.join(", ")
                          : result.score || "No scores"}
                      </td>
                      <td style={{ ...tdCellStyle, maxWidth: "300px", wordWrap: "break-word" }}>
                        {Array.isArray(result.feedback)
                          ? result.feedback.join(", ")
                          : result.feedback || "No feedback"}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        <span style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: "15px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          backgroundColor: (result.eval_status === 'completed') ? '#d4edda' : '#f8d7da',
                          color: (result.eval_status === 'completed') ? ' #155724' : ' #721c24',
                        }}>
                          {(result.eval_status || 'pending').charAt(0).toUpperCase() + (result.eval_status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        {Array.isArray(result.score) 
                          ? result.score.reduce((sum, current) => sum + current, 0)
                          : result.score || 0}
                      </td>
                      <td style={{ ...tdCellStyle }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                          {result.ticket === 1 ? (
                            <span style={{
                              padding: "0.3rem 0.6rem",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              backgroundColor: "#fff3cd",
                              color: "#856404",
                              border: "1px solid #ffeaa7"
                            }}>
                              Ticket Raised
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRaiseTicketClick(result._id)}
                              disabled={loadingTickets[result._id]}
                              style={{
                                background: "#ff6b6b",
                                border: "none",
                                color: "#fff",
                                padding: "0.4rem 0.6rem",
                                borderRadius: "4px",
                                cursor: loadingTickets[result._id] ? "not-allowed" : "pointer",
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                opacity: loadingTickets[result._id] ? 0.6 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (!loadingTickets[result._id]) {
                                  e.target.style.background = "#ff5252";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!loadingTickets[result._id]) {
                                  e.target.style.background = "#ff6b6b";
                                }
                              }}
                              title="Raise a ticket for this evaluation"
                            >
                              <FaExclamationTriangle />
                              {loadingTickets[result._id] ? "Raising..." : "Raise Ticket"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div
            style={{
              padding: "1rem",
              marginBottom: "1rem",
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
                Total Evaluations: {peerResultsForExam.length}
              </label>
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <label style={{ fontWeight: "bold", color: "#4b3c70" }}>
                Maximum Marks: {selectedExamForPeerResult?.totalMarks}
              </label>
            </div>

            <div style={{ flex: 1, textAlign: "right" }}>
              <label style={{ fontWeight: "bold", color: "#4b3c70" }}>
                Total Avg. Scored Marks: {calculateAverageScore()}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerResultOverlay;

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