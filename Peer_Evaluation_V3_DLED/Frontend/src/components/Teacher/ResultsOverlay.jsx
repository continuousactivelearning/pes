import React, { useEffect, useState } from 'react';

const ResultsOverlay = ({ resultsOverlayOpen, selectedExamForResults, resultsOverlayClose }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resultsOverlayOpen && selectedExamForResults) {
      setLoading(true);
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/teacher/view-results/${selectedExamForResults}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults(null);
          setLoading(false);
        });
    }
  }, [resultsOverlayOpen, selectedExamForResults]);

  if (!resultsOverlayOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        background: '#fff', padding: '2rem', borderRadius: '12px',
        minWidth: '400px', minHeight: '200px', position: 'relative'
      }}>
        <button
          onClick={resultsOverlayClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: '#8e44ad', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer'
          }}
        >
          Close
        </button>
        <h2>Results for Exam: {selectedExamForResults}</h2>
        {loading ? (
          <div>Loading...</div>
        ) : results ? (
          <div>
            {/* Example: Display results as a table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Student Name</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Email</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(results) && results.length > 0 ? (
                  results.map((result, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '8px' }}>{result.studentName || result.name}</td>
                      <td style={{ padding: '8px' }}>{result.studentEmail || result.email}</td>
                      <td style={{ padding: '8px' }}>{result.score}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '8px', textAlign: 'center' }}>No results available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No results found.</div>
        )}
      </div>
    </div>
  );
};

export default ResultsOverlay;