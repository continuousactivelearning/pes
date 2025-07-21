import React from "react";
import { FaTimes } from "react-icons/fa";

const ExamHistoryOverlay = ({ open, onClose, exams }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        color: "#4b3c70",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
          width: "90%",
          maxWidth: "700px",
          minHeight: "300px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
          overflow: "auto",
        }}
      >
        <button
          onClick={onClose}
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

        <h2 style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#4b3c70",
          fontWeight: 700,
          fontSize: "1.7rem",
          letterSpacing: "0.5px",
          textShadow: "0 1px 2px #e3e3f7"
        }}>
          Exam History
        </h2>

        <div style={{
          background: "#f7f6fd",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
          padding: "1.5rem 1rem",
          margin: "0 auto",
          width: "100%",
          maxWidth: "600px",
          overflowX: "auto"
        }}>
          {exams.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888" }}>No completed exams found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.08rem" }}>
              <thead>
                <tr style={{ background: "#ece9f7" }}>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Exam Name</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Batch</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{exam.name || "-"}</td>
                    <td style={{ padding: "10px" }}>
                      {exam.date ? new Date(exam.date).toLocaleDateString() : "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {exam.batch?.batchId || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {exam.totalMarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHistoryOverlay;
