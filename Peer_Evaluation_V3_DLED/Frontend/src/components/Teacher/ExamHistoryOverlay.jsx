import React from "react";
import { FaTimes } from "react-icons/fa";

const ExamHistoryOverlay = ({ examHistoryOverlayOpen, examHistoryOverlayClose, completedExams, handleDownloadResults }) => {
  if (!examHistoryOverlayOpen) return null;

  return (
    <div
      onClick={examHistoryOverlayClose}
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
          maxWidth: "1100px",
          minHeight: "400px",
          maxHeight: "94vh",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
          overflow: "auto",
        }}
      >
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
          borderRadius: "18px",
          boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
          padding: "1.5rem 1rem",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1000px",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "60vh",
        }}>
          {completedExams.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888" }}>No completed exams found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.08rem" }}>
              <thead>
                <tr style={{ background: "#ece9f7", position: "sticky", top: 0 }}>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Exam Name</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Date</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Course</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Batch</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Total Marks</th>
                  <th style={{ padding: "10px", fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedExams.map(exam => (
                  <tr key={exam._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{exam.name || "-"}</td>
                    <td style={{ padding: "10px" }}>
                      {exam.date ? new Date(exam.date).toLocaleDateString() : "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {exam.batch?.course?.courseName || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {exam.batch?.batchId || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {exam.totalMarks || "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        style={{
                          background: "#4b3c70",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.98rem",
                          boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
                          transition: "background 0.2s"
                        }}
                        onClick={() => handleDownloadResults(exam._id)}
                      >
                        Results CSV
                      </button>
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
