import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const ResultsOverlay = ({
  resultsOverlayOpen,
  selectedExamForResults,
  resultsOverlayClose,
  handleDownloadResults,
}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resultsOverlayOpen && selectedExamForResults) {
      setLoading(true);
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:5000/api/teacher/view-results/${selectedExamForResults}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }
  }, [resultsOverlayOpen, selectedExamForResults]);

  if (!resultsOverlayOpen) return null;

  return (
    <div
      onClick={resultsOverlayClose}
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
        zIndex: 1200,
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
          minHeight: "300px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Download CSV Button */}
        <button
          onClick={() => handleDownloadResults(selectedExamForResults)}
          style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "#4b3c70",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
            zIndex: 2,
          }}
          title="Download Results as CSV"
        >
          Download CSV
        </button>

        {/* Close Button */}
        <button
          onClick={resultsOverlayClose}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ textAlign: "center", margin: 0 }}>
            Results
          </h2>
          {loading ? (
            <div style={{ textAlign: "center", fontSize: "1.2rem" }}>
              Loading...
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#f9f9f9",
                padding: "1rem",
                maxHeight: "60vh",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "1rem",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        background: "#4b3c70",
                        color: "#fff",
                      }}
                    >
                      Student Name
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        background: "#4b3c70",
                        color: "#fff",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "8px",
                        background: "#4b3c70",
                        color: "#fff",
                      }}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(results) && results.length > 0 ? (
                    results.map((result, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "8px", color: "#4b3c70" }}>
                          {result.studentName ||
                            result.name ||
                            result.student?.name ||
                            "-"}
                        </td>
                        <td style={{ padding: "8px", color: "#4b3c70" }}>
                          {result.studentEmail ||
                            result.email ||
                            result.student?.email ||
                            "-"}
                        </td>
                        <td style={{ padding: "8px", color: "#4b3c70" }}>
                          {result.score}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          color: "#888",
                        }}
                      >
                        No results available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;