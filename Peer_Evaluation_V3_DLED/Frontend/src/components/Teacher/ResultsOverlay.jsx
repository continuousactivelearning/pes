import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ResultsOverlay = ({
  resultsOverlayOpen,
  selectedExamForResults,
  resultsOverlayClose,
  handleDownloadResults,
}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (resultsOverlayOpen && selectedExamForResults) {
      setLoadingAnalytics(true);
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:5000/api/teacher/results-analytics/${selectedExamForResults}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then(res => res.json())
        .then(data => {
          setAnalytics(data);
          setLoadingAnalytics(false);
        })
        .catch(() => {
          setAnalytics(null);
          setLoadingAnalytics(false);
        });
    }
  }, [resultsOverlayOpen, selectedExamForResults]);

  if (!resultsOverlayOpen) return null;

  const leaderboard = analytics?.leaderboard || [];
  const evalStatus = analytics?.evalStatus || { completed: 0, pending: 0, flagged: 0 };
  const histogramData = {
    labels: analytics?.histogram?.map(b => b.label) || [],
    datasets: [
      {
        label: "Number of Students",
        data: analytics?.histogram?.map(b => b.count) || [],
        backgroundColor: "#7c5fe6",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
  const questionWiseData = {
    labels: analytics?.questionAverages
      ? analytics.questionAverages.map((_, i) => `Q${i + 1}`)
      : [],
    datasets: [
      {
        label: "Average Score",
        data: analytics?.questionAverages || [],
        backgroundColor: "#1e88e5",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
  const scatterData = {
    datasets: [
      {
        label: "Students",
        data: analytics?.scatterData || [],
        backgroundColor: "#43a047",
        pointRadius: 6,
        pointHoverRadius: 9,
      },
    ],
  };

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
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
          width: "90%",
          maxWidth: "1200px",
          minHeight: "300px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
          overflow: "auto",
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

        {/* Leaderboard Card */}
        <div style={{
          margin: "0.5rem 0",
          maxWidth: 340,
          alignSelf: "center",
          background: "#f7f6fd",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
          padding: "1.5rem 1rem"
        }}>
          <h3 style={{
            textAlign: "center",
            marginBottom: "0.7rem",
            fontSize: "1.35rem",
            color: "#4b3c70",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textShadow: "0 1px 2px #e3e3f7"
          }}>Leaderboard</h3>
          <ol style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#4b3c70",
            fontSize: "1.12rem",
            margin: 0,
            padding: 0,
            listStyle: "decimal inside"
          }}>
            {leaderboard.map((student, idx) => (
              <li key={idx} style={{
                margin: "0.4rem 0",
                background: idx === 0 ? "#e3e3f7" : idx === 1 ? "#fffbe7" : idx === 2 ? "#fdeaea" : "transparent",
                borderRadius: "8px",
                padding: "0.4rem 0.7rem",
                fontWeight: idx === 0 ? 700 : 500,
                boxShadow: idx < 3 ? "0 2px 8px rgba(75,60,112,0.08)" : "none",
                border: idx < 3 ? "1px solid #e3e3f7" : "none"
              }}>
                <span>{student.name}</span>
                <span style={{ color: "#888", marginLeft: 8 }}>({student.avg.toFixed(2)})</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Status Cards */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          margin: "1.5rem 0"
        }}>
          <div style={{
            background: "#e3e3f7",
            borderRadius: "16px",
            padding: "1.2rem 2.2rem",
            textAlign: "center",
            minWidth: 120,
            boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
            border: "1px solid #e3e3f7"
          }}>
            <div style={{ fontWeight: 700, color: "#388e3c", fontSize: "1.15rem", marginBottom: "0.3rem" }}>Completed</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 700 }}>{evalStatus.completed}</div>
          </div>
          <div style={{
            background: "#fffbe7",
            borderRadius: "16px",
            padding: "1.2rem 2.2rem",
            textAlign: "center",
            minWidth: 120,
            boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
            border: "1px solid #fffbe7"
          }}>
            <div style={{ fontWeight: 700, color: "#fbc02d", fontSize: "1.15rem", marginBottom: "0.3rem" }}>Pending</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 700 }}>{evalStatus.pending}</div>
          </div>
          <div style={{
            background: "#fdeaea",
            borderRadius: "16px",
            padding: "1.2rem 2.2rem",
            textAlign: "center",
            minWidth: 120,
            boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
            border: "1px solid #fdeaea"
          }}>
            <div style={{ fontWeight: 700, color: "#d32f2f", fontSize: "1.15rem", marginBottom: "0.3rem" }}>Flagged</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 700 }}>{evalStatus.flagged}</div>
          </div>
        </div>

        {/* First row: Histogram & Question-wise */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Histogram */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#7c5fe6",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Histogram of Student Averages
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={histogramData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      title: { display: true, text: "Average Score Range", color: "#7c5fe6", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Number of Students", color: "#7c5fe6", font: { size: 14, weight: "bold" } },
                      ticks: {
                        font: { size: 12 },
                        color: "#4b3c70",
                        stepSize: 1,
                        callback: value => (Number.isInteger(value) ? value : null),
                      },
                      beginAtZero: true,
                      precision: 0,
                    },
                  },
                }}
                height={120}
                width={350}
              />
            )}
          </div>
          {/* Question-wise Average Scores */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#1e88e5",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Question-wise Average Scores
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={questionWiseData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      title: { display: true, text: "Question", color: "#1e88e5", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Average Score", color: "#1e88e5", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    },
                  },
                }}
                height={120}
                width={350}
              />
            )}
          </div>
        </div>

        {/* Second row: Scatter & Status Bar */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* Scatter Plot */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#43a047",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Student Averages vs. Number of Evaluations
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                type="scatter"
                data={scatterData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const d = context.raw;
                          return `${d.label}: ${d.x} evals, avg ${d.y.toFixed(2)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Number of Evaluations", color: "#43a047", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Average Score", color: "#43a047", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    },
                  },
                }}
                height={120}
                width={350}
              />
            )}
          </div>
          {/* Status Bar Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#283593",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Evaluation Status Counts
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: ["Completed", "Pending", "Flagged"],
                  datasets: [{
                    label: "Count",
                    data: [evalStatus.completed, evalStatus.pending, evalStatus.flagged],
                    backgroundColor: ["#388e3c", "#fbc02d", "#d32f2f"],
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      title: { display: true, text: "Status", color: "#283593", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Count", color: "#283593", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    }
                  }
                }}
                height={120}
                width={350}
              />
            )}
          </div>
        </div>

        {/* Third row: K-Marks Chart & Grade Distribution */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* K vs Marks Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#8e24aa",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              K-Parameter vs Total Marks
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: ["K Parameter", "Total Marks"],
                  datasets: [{
                    label: "Values",
                    data: [analytics?.examInfo?.k || 0, analytics?.examInfo?.totalMarks || 0],
                    backgroundColor: ["#8e24aa", "#ff7043"],
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          if (context.dataIndex === 0) {
                            return `K Parameter: ${context.parsed.y}`;
                          } else {
                            return `Total Marks: ${context.parsed.y}`;
                          }
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Exam Parameters", color: "#8e24aa", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Value", color: "#8e24aa", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    }
                  }
                }}
                height={120}
                width={350}
              />
            )}
          </div>

          {/* Grade Distribution Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#d84315",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Grade Distribution
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
                  datasets: [{
                    label: "Students",
                    data: [
                      analytics?.gradeDistribution?.["A+"] || 0,
                      analytics?.gradeDistribution?.["A"] || 0,
                      analytics?.gradeDistribution?.["B+"] || 0,
                      analytics?.gradeDistribution?.["B"] || 0,
                      analytics?.gradeDistribution?.["C+"] || 0,
                      analytics?.gradeDistribution?.["C"] || 0,
                      analytics?.gradeDistribution?.["D"] || 0,
                      analytics?.gradeDistribution?.["F"] || 0,
                    ],
                    backgroundColor: ["#2e7d32", "#388e3c", "#43a047", "#66bb6a", "#fbc02d", "#ff9800", "#ff5722", "#d32f2f"],
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      title: { display: true, text: "Grade", color: "#d84315", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Number of Students", color: "#d84315", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    }
                  }
                }}
                height={120}
                width={350}
              />
            )}
          </div>
        </div>

        {/* Fourth row: Participation & Performance Trends */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* Participation Rate Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#00695c",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Participation Rate
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: ["Attended", "Absent"],
                  datasets: [{
                    label: "Students",
                    data: [
                      analytics?.participation?.attended || 0,
                      (analytics?.participation?.total || 0) - (analytics?.participation?.attended || 0)
                    ],
                    backgroundColor: ["#26a69a", "#ef5350"],
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const total = analytics?.participation?.total || 0;
                          const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
                          return `${context.label}: ${context.parsed.y} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Attendance", color: "#00695c", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Number of Students", color: "#00695c", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    }
                  }
                }}
                height={120}
                width={350}
              />
            )}
          </div>

          {/* Average Score by Difficulty Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(75,60,112,0.13)",
              padding: "2rem 1.2rem",
              marginBottom: "1.5rem",
              transition: "box-shadow 0.2s",
              cursor: "default",
              border: "1px solid #f7f6fd",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,60,112,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(75,60,112,0.13)")}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1.2rem",
                fontSize: "1.25rem",
                color: "#6a1b9a",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px #f7f6fd",
              }}
            >
              Score vs. Evaluations Completed
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: analytics?.evaluationEfficiency?.map(item => `${item.evaluationsCount} evals`) || [],
                  datasets: [{
                    label: "Average Score",
                    data: analytics?.evaluationEfficiency?.map(item => item.averageScore) || [],
                    backgroundColor: "#ab47bc",
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `Avg Score: ${context.parsed.y.toFixed(2)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Evaluations Completed", color: "#6a1b9a", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" }
                    },
                    y: {
                      title: { display: true, text: "Average Score", color: "#6a1b9a", font: { size: 14, weight: "bold" } },
                      ticks: { font: { size: 12 }, color: "#4b3c70" },
                      beginAtZero: true,
                      precision: 0,
                    }
                  }
                }}
                height={120}
                width={350}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;