import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart, LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";
Chart.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

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

  const evaluationDistributionData = (() => {
    if (!analytics?.scatterData || analytics.scatterData.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: "Number of Students",
          data: [],
          backgroundColor: "#43a047",
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    // Group students by number of evaluations
    const evaluationCounts = {};
    analytics.scatterData.forEach(point => {
      const evalCount = point.x;
      evaluationCounts[evalCount] = (evaluationCounts[evalCount] || 0) + 1;
    });

    const labels = Object.keys(evaluationCounts).sort((a, b) => parseInt(a) - parseInt(b));
    const data = labels.map(label => evaluationCounts[label]);

    return {
      labels: labels.map(label => `${label} evaluation${parseInt(label) === 1 ? '' : 's'}`),
      datasets: [{
        label: "Number of Students",
        data: data,
        backgroundColor: "#43a047",
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  })();

  const participationData = {
    labels: ["Attended", "Absent"],
    datasets: [
      {
        data: [
          analytics?.participation?.attended || 0,
          (analytics?.participation?.total || 0) - (analytics?.participation?.attended || 0)
        ],
        backgroundColor: [
          "rgba(38, 166, 154, 0.9)",
          "rgba(239, 83, 80, 0.9)"
        ],
        borderColor: [
          "#26a69a",
          "#ef5350"
        ],
        borderWidth: 3,
        hoverOffset: 15,
        hoverBackgroundColor: [
          "#1e8e3e",
          "#d32f2f"
        ],
        hoverBorderColor: "#fff",
        hoverBorderWidth: 4
      }
    ]
  };

  const performanceBreakdownData = (() => {
    if (!analytics?.histogram || analytics.histogram.length === 0) {
      return {
        labels: ["90-100%", "80-89%", "70-79%", "60-69%", "50-59%", "Below 50%"],
        datasets: [{
          label: "Number of Students",
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: [
            "#2e7d32",
            "#4caf50",
            "#8bc34a",
            "#ffc107",
            "#ff9800",
            "#f44336",
          ],
          borderColor: [
            "#1b5e20",
            "#388e3c", 
            "#689f38",
            "#ff8f00",
            "#f57c00",
            "#d32f2f",
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    let excellent = 0, good = 0, average = 0, belowAverage = 0, poor = 0, failing = 0;
    
    analytics.histogram.forEach(bin => {
      const range = bin.label;
      const count = bin.count;      
      const lowerBound = parseFloat(range.split(' - ')[0]);
      
      if (lowerBound >= 90) excellent += count;
      else if (lowerBound >= 80) good += count;
      else if (lowerBound >= 70) average += count;
      else if (lowerBound >= 60) belowAverage += count;
      else if (lowerBound >= 50) poor += count;
      else failing += count;
    });

    return {
      labels: ["90-100%", "80-89%", "70-79%", "60-69%", "50-59%", "Below 50%"],
      datasets: [{
        label: "Number of Students",
        data: [excellent, good, average, belowAverage, poor, failing],
        backgroundColor: [
          "#2e7d32",
          "#4caf50",
          "#8bc34a",
          "#ffc107",
          "#ff9800",
          "#f44336",
        ],
        borderColor: [
          "#1b5e20",
          "#388e3c",
          "#689f38", 
          "#ff8f00",
          "#f57c00",
          "#d32f2f",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  })();

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
              height: "320px",
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
              <div style={{ height: "220px" }}>
                <Bar
                  data={histogramData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        title: { display: true, text: "Average Score Range", color: "#7c5fe6", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          maxRotation: 45,
                          minRotation: 0
                        }
                      },
                      y: {
                        title: { display: true, text: "Number of Students", color: "#7c5fe6", font: { size: 14, weight: "bold" } },
                        ticks: {
                          font: { size: 12 },
                          color: "#4b3c70",
                          padding: 10,
                          stepSize: 1,
                          callback: value => (Number.isInteger(value) ? value : null),
                        },
                        beginAtZero: true,
                        precision: 0,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Question-wise Average Scores */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              <div style={{ height: "220px" }}>
                <Bar
                  data={questionWiseData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        title: { display: true, text: "Question", color: "#1e88e5", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          maxRotation: 45,
                          minRotation: 0
                        }
                      },
                      y: {
                        title: { display: true, text: "Average Score", color: "#1e88e5", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        },
                        beginAtZero: true,
                        precision: 0,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Second row: Evaluation Distribution & Status Bar */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* Evaluation Distribution Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              Evaluation Distribution
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <div style={{ height: "220px" }}>
                <Bar
                  data={evaluationDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "#43a047",
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            const total = evaluationDistributionData.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
                            return `Students: ${context.parsed.y} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: { display: true, text: "Number of Evaluations Completed", color: "#43a047", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10,
                          maxRotation: 45,
                          minRotation: 0
                        },
                        grid: { color: "rgba(67, 160, 71, 0.1)" }
                      },
                      y: {
                        title: { display: true, text: "Number of Students", color: "#43a047", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10,
                          stepSize: 1,
                          callback: value => Number.isInteger(value) ? value : null
                        },
                        beginAtZero: true,
                        grid: { color: "rgba(67, 160, 71, 0.1)" }
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Status Bar Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              <div style={{ height: "220px" }}>
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
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        title: { display: true, text: "Status", color: "#283593", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        }
                      },
                      y: {
                        title: { display: true, text: "Count", color: "#283593", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        },
                        beginAtZero: true,
                        precision: 0,
                      }
                    }
                  }}
                />
              </div>
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
              height: "320px",
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
              K-Parameter Impact on Performance
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <div style={{ height: "220px" }}>
                <Line
                  data={{
                    labels: analytics?.kParameterImpact?.map(item => `K=${item.k}`) || [`K=${analytics?.examInfo?.k || 3}`],
                    datasets: [{
                      label: "Average Score",
                      data: analytics?.kParameterImpact?.map(item => item.averageScore) || [
                        analytics?.histogram?.reduce((total, bin) => total + (bin.count * parseFloat(bin.label.split(' - ')[0])), 0) / 
                        analytics?.histogram?.reduce((total, bin) => total + bin.count, 1) || 0
                      ],
                      borderColor: "#8e24aa",
                      backgroundColor: "rgba(142, 36, 170, 0.1)",
                      borderWidth: 3,
                      pointBackgroundColor: "#8e24aa",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                      fill: true,
                      tension: 0.4
                    }, {
                      label: "Total Marks",
                      data: analytics?.kParameterImpact?.map(() => analytics?.examInfo?.totalMarks || 100) || [analytics?.examInfo?.totalMarks || 100],
                      borderColor: "#ff7043",
                      backgroundColor: "rgba(255, 112, 67, 0.1)",
                      borderWidth: 2,
                      borderDash: [5, 5],
                      pointBackgroundColor: "#ff7043",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      fill: false,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { 
                      legend: { 
                        display: true,
                        position: 'top',
                        labels: {
                          font: { size: 11 },
                          color: "#4b3c70",
                          usePointStyle: true
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            if (context.datasetIndex === 0) {
                              return `Avg Score: ${context.parsed.y.toFixed(2)}`;
                            } else {
                              return `Total Marks: ${context.parsed.y}`;
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: { display: true, text: "K-Parameter Value", color: "#8e24aa", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        },
                        grid: { color: "rgba(142, 36, 170, 0.1)" }
                      },
                      y: {
                        title: { display: true, text: "Score", color: "#8e24aa", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        },
                        beginAtZero: true,
                        grid: { color: "rgba(142, 36, 170, 0.1)" }
                      }
                    },
                    elements: {
                      point: {
                        hoverBackgroundColor: "#8e24aa"
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Grade Distribution Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              <div style={{ height: "220px" }}>
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
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        title: { display: true, text: "Grade", color: "#d84315", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        }
                      },
                      y: {
                        title: { display: true, text: "Number of Students", color: "#d84315", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10
                        },
                        beginAtZero: true,
                        precision: 0,
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fourth row: Participation Pie Chart & Performance Breakdown */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* Participation Rate Pie Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              <div style={{ height: "220px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pie
                  data={participationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: { size: 13, weight: 'bold' },
                          color: "#4b3c70",
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "#00695c",
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            const total = analytics?.participation?.total || 0;
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    animation: {
                      animateRotate: true,
                      animateScale: true,
                      duration: 1000
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Performance Breakdown Chart */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 400,
              height: "320px",
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
              Performance Breakdown
            </h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <div style={{ height: "220px" }}>
                <Bar
                  data={performanceBreakdownData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }
                    },
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "#6a1b9a",
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            const total = performanceBreakdownData.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
                            return `Students: ${context.parsed.y} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: { display: true, text: "Score Range", color: "#6a1b9a", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 11 }, 
                          color: "#4b3c70",
                          padding: 10,
                          maxRotation: 45,
                          minRotation: 0
                        },
                        grid: { color: "rgba(106, 27, 154, 0.1)" }
                      },
                      y: {
                        title: { display: true, text: "Number of Students", color: "#6a1b9a", font: { size: 14, weight: "bold" } },
                        ticks: { 
                          font: { size: 12 }, 
                          color: "#4b3c70",
                          padding: 10,
                          stepSize: 1,
                          callback: value => Number.isInteger(value) ? value : null
                        },
                        beginAtZero: true,
                        grid: { color: "rgba(106, 27, 154, 0.1)" }
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;