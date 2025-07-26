import React from 'react';

export default function StudentExamsTab({
  sectionHeading,
  studentBatches,
  selectedBatchForExam,
  setSelectedBatchForExam,
  batchExams,
  fileInputRefs,
  handleExamFileChange,
  handleExamFileUpload,
  examFileMap,
  handleExamHistory
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#2d3559",
        width: "100%",
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'relative', 
        marginBottom: '2rem',
        width: '100%'
      }}>
        <h2
          style={{
            ...sectionHeading,
            marginTop: 0,
            marginBottom: "2rem",
            textAlign: 'center',
            color: "#3f3d56",
          }}
        >
          Exams
        </h2>
        <button
          onClick={handleExamHistory}
          style={{
            position: 'absolute',
            right: 0,
            background: '#4b3c70',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(60,60,120,0.12)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#3a2d56'}
          onMouseLeave={(e) => e.target.style.background = '#4b3c70'}
        >
          Exam History
        </button>
      </div>
      
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "1rem", fontWeight: 500 }}>
          Filter by Batch:{" "}
        </label>
        <select
          value={selectedBatchForExam}
          onChange={(e) => setSelectedBatchForExam(e.target.value)}
          style={{
            minWidth: 180,
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "1.5px solid #4b3c70",
            fontSize: "1rem",
            background: "#fff",
            color: "#000",
            fontWeight: 500,
            transition: "background 0.2s",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Batches</option>
          {studentBatches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.courseName} - {batch.batchId}
            </option>
          ))}
        </select>
      </div>
      {/* style={{ maxHeight: '300px', maxWidth: '1300px', overflowY: 'auto', overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: ' #4b3c70 transparent' }} */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #4b3c70",
        }}
      >
        <thead
          style={{
            backgroundColor: "#4b3c70",
            color: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <tr>
            <th style={{ padding: "12px", textAlign: "center" }}>Exam Name</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Date</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Time</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Duration</th>
            <th style={{ padding: "12px", textAlign: "center" }}>
              Upload File
            </th>
          </tr>
        </thead>
        <tbody>
          {batchExams.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                No exams found.
              </td>
            </tr>
          ) : (
            batchExams.map((exam) => (
              <tr key={exam._id}>
                <td style={{ padding: "12px", fontWeight: 500 }}>
                  {exam.name}
                </td>
                <td style={{ padding: "12px", fontWeight: 500 }}>
                  {new Date(exam.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px", fontWeight: 500 }}>
                  {exam.time}
                </td>
                <td style={{ padding: "12px", fontWeight: 500 }}>
                  {exam.duration} mins
                </td>
                <td style={{ padding: "12px", fontWeight: 500 }}>
                  {(() => {
                    const now = new Date();
                    const examDate = new Date(exam.date);

                    const isToday =
                      now.getFullYear() === examDate.getFullYear() &&
                      now.getMonth() === examDate.getMonth() &&
                      now.getDate() === examDate.getDate();

                    const [startHour, startMinute] = exam.time
                      .split(":")
                      .map(Number);
                    const startMinutes = startHour * 60 + startMinute;
                    const endMinutes = startMinutes + (exam.duration || 0);

                    const currentMinutes =
                      now.getHours() * 60 + now.getMinutes();

                    if (!isToday) {
                      return (
                        <span style={{ color: "#888" }}>Submission time is over.</span>
                      );
                    }
                    if (currentMinutes < startMinutes) {
                      return (
                        <span style={{ color: "#888" }}>
                          Exam yet to start.
                        </span>
                      );
                    }
                    if (currentMinutes >= endMinutes) {
                      return (
                        <span style={{ color: "#888" }}>Submission time is over.</span>
                      );
                    }
                    return (
                      <>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          ref={(el) => (fileInputRefs.current[exam._id] = el)}
                          onChange={(e) =>
                            handleExamFileChange(exam._id, e.target.files[0])
                          }
                          style={{ marginBottom: 4 }}
                        />
                        <button
                          onClick={() => handleExamFileUpload(exam._id)}
                          disabled={!examFileMap[exam._id]}
                          style={{
                            background: examFileMap[exam._id]
                              ? "#4b3c70"
                              : "#a0a0a0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.4rem 1.2rem",
                            fontWeight: 500,
                            cursor: examFileMap[exam._id]
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          Upload
                        </button>
                      </>
                    );
                  })()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}