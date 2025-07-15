import React from "react";
import { FaTimes, FaEdit, FaFlag } from "react-icons/fa";

export default function PeerEvaluationsOverlay({ flaggedEvaluationsOverlayOpen, flaggedEvaluationsOverlayClose, flaggedEvaluations, handleEditEvaluationOverlayOpen }) {
  if (!flaggedEvaluationsOverlayOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1100,
      }}
      onClick={flaggedEvaluationsOverlayClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          width: "1200px",
          height: "700px",
          minWidth: "300px",
          maxWidth: "90%",
          maxHeight: "85%",
          overflowX: "auto",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(60,60,120,0.18)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={flaggedEvaluationsOverlayClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "#fc1717",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Close
        </button>
        <h2 style={{ marginBottom: "1.5rem", color: "#4b3c70" }}>Flagged Evaluations</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            minWidth: "600px",
            maxWidth: "1200px",
            borderCollapse: "collapse",
            background: "#fff",
            fontSize: "0.95rem",
            borderRadius: "8px",
            overflowX: "auto",
          }}>
            <thead style={{ backgroundColor: "#4b3c70", color: "#fff" }}>
              <tr>
                <th style={{ ...thCellStyle }}>Student</th>
                <th style={{ ...thCellStyle }}>Evaluator</th>
                <th style={{ ...thCellStyle }}>Total Score</th>
                <th style={{ ...thCellStyle }}>Feedback</th>
                <th style={{ ...thCellStyle }}>Document</th>
                <th style={{ ...thCellStyle }}>Status</th>
                <th style={{ ...thCellStyle }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "gray" }}>
                    No evaluations found.
                  </td>
                </tr>
              ) : (
                flaggedEvaluations.map((evaluation, idx) => (
                  <tr key={evaluation._id || idx} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ ...tdCellStyle }}>{evaluation.student?.name || "Unknown"}</td>
                    <td style={{ ...tdCellStyle }}>{evaluation.evaluator?.name || "Unknown"}</td>
                    <td style={{ ...tdCellStyle }}>
                      {Array.isArray(evaluation.score)
                        ? evaluation.score.reduce((sum, val) => sum + val, 0)
                        : evaluation.score || 0}
                    </td>
                    <td style={{ ...tdCellStyle }}>
                      {Array.isArray(evaluation.feedback)
                        ? evaluation.feedback.join(", ")
                        : evaluation.feedback || "No feedback"}
                    </td>
                    <td style={{ ...tdCellStyle }}>
                      {evaluation.document?.documentPath ? (
                        <a
                          href={`http://localhost:5000/${evaluation.document.documentPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#4b3c70", textDecoration: "underline" }}
                        >
                          View File
                        </a>
                      ) : "No file"}
                    </td>
                    <td style={{ ...tdCellStyle, fontWeight: "bold", color: evaluation.eval_status === "pending" ? "#d32f2f" : "#43a047" }}>
                      {evaluation.eval_status.charAt(0).toUpperCase() + evaluation.eval_status.slice(1)}
                    </td>
                    <td style={{ ...tdCellStyle }}>
                      <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                        <button style={btnAccept} onClick={() => handleEditEvaluationOverlayOpen(evaluation)}>
                          <FaEdit />
                        </button>
                        <button style={btnDecline} onClick={() => console.log("Delete Evaluation")}>
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

const btnAccept = {
  padding: "4px 8px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#4caf50",
  color: "#fff",
  cursor: "pointer",
};

const btnFlag = {
  padding: "4px 8px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: " #df610d",
  color: "#fff",
  cursor: "pointer",
};

const btnDecline = {
  padding: "4px 8px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#fc1717",
  color: "#fff",
  cursor: "pointer",
};
