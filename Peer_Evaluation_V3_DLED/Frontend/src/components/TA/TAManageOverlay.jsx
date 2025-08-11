import React from "react";
import { FaCheck, FaTimes, FaEdit, FaFlag } from "react-icons/fa";

export default function ManageOverlay({
  showTAManageOverlay,
  closeTAManageOverlay,
  pendingEnrollments,
  flaggedEvaluations,
  acceptEnrollment,
  declineEnrollment,
  selectedTAExam,
  setSelectedTAExam,
  TAEditEval,
  TAFlagEval,
  TADelEval,
}) {
  if (!showTAManageOverlay) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={closeTAManageOverlay}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          width: "95%",
          maxWidth: "1700px",
          height: "90%",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pending Enrollments Column */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h3 style={{ marginBottom: "1rem" }}>Pending Enrollments</h3>
          {pendingEnrollments.length > 0 ? (
            <div
              style={{
                maxHeight: "calc(90vh - 180px)",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #5c5470", boxShadow: "0 4px 12px #4b3c70" }}>
                <thead style={{ backgroundColor: "#4b3c70", color: "#fff" }}>
                  <tr>
                    <th style={{ padding: "8px" }}>Name</th>
                    <th style={{ padding: "8px" }}>Email</th>
                    <th style={{ padding: "8px" }}>Status</th>
                    <th style={{ padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEnrollments.map((enroll, idx) => (
                    <tr key={idx}>
                      <td style={cellStyle}>{enroll.student.name}</td>
                      <td style={cellStyle}>{enroll.student.email}</td>
                      <td style={cellStyle}>
                        {enroll.status.charAt(0).toUpperCase() + enroll.status.slice(1)}
                      </td>
                      <td style={cellStyle}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <button style={btnAccept} onClick={() => acceptEnrollment(enroll._id)}>
                            <FaCheck />
                          </button>
                          <button style={btnDecline} onClick={() => declineEnrollment(enroll._id)}>
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No pending enrollments found.</p>
          )}
        </div>

        {/* Flagged Evaluations Column */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h3 style={{ marginBottom: "1rem" }}>Flagged Evaluations</h3>
          {flaggedEvaluations.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ marginRight: "0.5rem", fontWeight: 500 }}>Filter by Exam:</label>
              <select
                value={selectedTAExam || ""}
                onChange={(e) => setSelectedTAExam(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  border: "1px solid #4b3c70",
                  fontSize: "0.9rem",
                  background: "#fff",
                  color: "#000",
                  fontWeight: 500,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">All Exams</option>
                {flaggedEvaluations.map((examGroup, idx) => (
                  <option key={idx} value={examGroup.exam._id}>
                    {examGroup.exam.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {flaggedEvaluations.length === 0 ? (
            <p>No flagged evaluations available.</p>
          ) : (
            (selectedTAExam
              ? flaggedEvaluations.filter((eg) => eg.exam._id === selectedTAExam)
              : flaggedEvaluations
            ).map((examGroup, idx) => (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: "bold" }}>
                  {examGroup.exam.name} — {new Date(examGroup.exam.date).toLocaleDateString()}
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", border: "1px solid #5c5470", boxShadow: "0 4px 12px #4b3c70" }}>
                    <thead style={{ backgroundColor: "#4b3c70", color: "#fff" }}>
                      <tr>
                        <th style={cellHeader}>Evaluator</th>
                        <th style={cellHeader}>Student</th>
                        <th style={cellHeader}>Status</th>
                        <th style={cellHeader}>Feedback</th>
                        <th style={cellHeader}>Score</th>
                        {/* <th style={cellHeader}>Ticket</th> */}
                        <th style={cellHeader}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examGroup.evaluations.map((evalItem, idx) => (
                        <tr key={idx}>
                          <td style={cellStyle}>{evalItem.evaluator.name}</td>
                          <td style={cellStyle}>{evalItem.student.name}</td>
                          <td style={cellStyle}>
                            {evalItem.eval_status.charAt(0).toUpperCase() +
                              evalItem.eval_status.slice(1)}
                          </td>
                          <td style={{ ...cellStyle, maxWidth: 100, overflow: "hidden" }}>
                            {Array.isArray(evalItem.feedback)
                              ? evalItem.feedback.join(", ")
                              : evalItem.feedback || "No feedback"}
                          </td>
                          <td style={cellStyle}>
                            {Array.isArray(evalItem.score) 
                              ? evalItem.score.reduce((sum, current) => sum + current, 0)
                              : evalItem.score}
                          </td>
                          {/* <td style={cellStyle}>{evalItem.ticket}</td> */}
                          <td style={cellStyle}>
                            <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                              <button style={btnAccept} onClick={() => TAEditEval(evalItem)}>
                                <FaEdit />
                              </button>
                              <button style={btnFlag} onClick={() => TAFlagEval(evalItem)}>
                                <FaFlag />
                              </button>
                              {evalItem.eval_status !== "pending" && (
                                <button style={btnDecline} onClick={() => TADelEval(evalItem)}>
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={closeTAManageOverlay}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.5rem 1rem",
            background: "#fc1717",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

// Reusable styles
const cellStyle = {
  padding: "8px",
  textAlign: "center",
  fontWeight: 500,
};

const cellHeader = {
  padding: "6px",
  textAlign: "center",
  fontWeight: "bold",
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
