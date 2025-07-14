import React from "react";

export default function PeerEvaluationsOverlay({ isOpen, onClose, evaluations }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          minWidth: "800px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(60,60,120,0.18)",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
        <h2 style={{ marginBottom: "1.5rem", color: "#4b3c70" }}>Peer Evaluations with Ticket = 2</h2>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "0.95rem",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          <thead style={{ backgroundColor: "#4b3c70", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px" }}>Student</th>
              <th style={{ padding: "12px" }}>Evaluator</th>
              <th style={{ padding: "12px" }}>Document</th>
              <th style={{ padding: "12px" }}>Ticket</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "gray" }}>
                  No evaluations found with ticket = 2.
                </td>
              </tr>
            ) : (
              evaluations.map((ev, idx) => (
                <tr key={ev._id || idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{ev.student?.name || "Unknown"}</td>
                  <td style={{ padding: "12px" }}>{ev.evaluator?.name || "Unknown"}</td>
                  <td style={{ padding: "12px" }}>
                    {ev.document?.documentPath ? (
                      <a
                        href={`http://localhost:5000/${ev.document.documentPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#4b3c70", textDecoration: "underline" }}
                      >
                        View File
                      </a>
                    ) : "No file"}
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#FFA500" }}>
                    {ev.ticket}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}