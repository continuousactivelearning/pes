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
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [histogramBins, setHistogramBins] = useState([]);
  const [averages, setAverages] = useState([]);
  const [loadingAverages, setLoadingAverages] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const evalStatus = analytics?.evalStatus || { completed: 0, pending: 0, flagged: 0 };

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
  const histogramData = {
    labels: analytics?.histogram?.map(b => b.label) || [],
    datasets: [
      {
        label: "Number of Students",
        data: analytics?.histogram?.map(b => b.count) || [],
        backgroundColor: "#4b3c70",
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
      },
    ],
  };
  const scatterData = {
    datasets: [
      {
        label: "Students",
        data: analytics?.scatterData || [],
        backgroundColor: "#43a047",
      },
    ],
  };

<div style={{
  display: "flex",
  justifyContent: "center",
  gap: "2rem",
  margin: "1.5rem 0"
}}>
  <div style={{
    background: "#e3e3f7",
    borderRadius: "8px",
    padding: "1rem 2rem",
    textAlign: "center",
    minWidth: 120
  }}>
    <div style={{ fontWeight: 600, color: "#388e3c" }}>Completed</div>
    <div style={{ fontSize: "1.5rem" }}>{evalStatus.completed}</div>
  </div>
  <div style={{
    background: "#fffbe7",
    borderRadius: "8px",
    padding: "1rem 2rem",
    textAlign: "center",
    minWidth: 120
  }}>
    <div style={{ fontWeight: 600, color: "#fbc02d" }}>Pending</div>
    <div style={{ fontSize: "1.5rem" }}>{evalStatus.pending}</div>
  </div>
  <div style={{
    background: "#fdeaea",
    borderRadius: "8px",
    padding: "1rem 2rem",
    textAlign: "center",
    minWidth: 120
  }}>
    <div style={{ fontWeight: 600, color: "#d32f2f" }}>Flagged</div>
    <div style={{ fontSize: "1.5rem" }}>{evalStatus.flagged}</div>
  </div>
</div>

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

        {/* Leaderboard at the top */}
        <div style={{ margin: "0.5rem 0", maxWidth: 300, alignSelf: "center" }}>
          <h3 style={{ textAlign: "center", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Leaderboard</h3>
          <ol style={{ textAlign: "center", fontWeight: "bold", color: "#4b3c70", fontSize: "1rem", margin: 0, padding: 0 }}>
            {leaderboard.map((student, idx) => (
              <li key={idx} style={{ margin: "0.2rem 0" }}>
                {student.name} ({student.avg.toFixed(2)})
              </li>
            ))}
          </ol>
        </div>

        {/* First row: Histogram & Question-wise */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Histogram */}
          <div style={{ flex: "1 1 400px", maxWidth: 400 }}>
            <h3 style={{ textAlign: "center", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Histogram of Student Averages</h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={histogramData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: "Average Score Range" }, ticks: { font: { size: 10 } } },
                    y: {
                      title: { display: true, text: "Number of Students" },
                      ticks: {
                        font: { size: 10 },
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
          <div style={{ flex: "1 1 400px", maxWidth: 400 }}>
            <h3 style={{ textAlign: "center", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Question-wise Average Scores</h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={questionWiseData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: "Question" }, ticks: { font: { size: 10 } } },
                    y: { title: { display: true, text: "Average Score" }, beginAtZero: true, precision: 0 },
                  },
                }}
                height={120}
                width={350}
              />
            )}
          </div>
        </div>

        {/* Second row: Scatter & Stacked Bar */}
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {/* Scatter Plot */}
          <div style={{ flex: "1 1 400px", maxWidth: 400 }}>
            <h3 style={{ textAlign: "center", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Student Averages vs. Number of Evaluations</h3>
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
                    x: { title: { display: true, text: "Number of Evaluations" }, beginAtZero: true, precision: 0 },
                    y: { title: { display: true, text: "Average Score" }, beginAtZero: true, precision: 0 },
                  },
                }}
                height={120}
                width={350}
              />
            )}
          </div>
          {/* Stacked Bar Chart */}
          <div style={{ flex: "1 1 400px", maxWidth: 400 }}>
            <h3 style={{ textAlign: "center", marginBottom: "0.3rem", fontSize: "1.1rem" }}>Evaluation Status per Student</h3>
            {loadingAnalytics ? (
              <div style={{ textAlign: "center" }}>Loading chart...</div>
            ) : (
              <Bar
                data={{
                  labels: ["Completed", "Pending", "Flagged"],
                  datasets: [{
                    label: "Count",
                    data: [evalStatus.completed, evalStatus.pending, evalStatus.flagged],
                    backgroundColor: ["#388e3c", "#fbc02d", "#d32f2f"]
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: "Status" } },
                    y: { title: { display: true, text: "Count" }, beginAtZero: true, precision: 0 }
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