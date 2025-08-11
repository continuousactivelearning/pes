import React from 'react';

export default function EnrollmentRequestSection({
  availableCourses,
  selectedCourse,
  setSelectedCourse,
  availableBatches,
  selectedBatch,
  setSelectedBatch,
  handleEnrollmentRequest,
}) {
  return (
    <div
      style={{
        flex: 1.3,
        minWidth: 200,
        maxWidth: 600,
        borderRadius: "18px",
        boxShadow: "0 4px 12px #4b3c70",
        padding: "2rem 2.5rem",
        border: "1.5px solid #4b3c70",
      }}
    >
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: "bold",
          marginBottom: "1.2rem",
          letterSpacing: "0.5px",
        }}
      >
        New Enrollment
      </h3>
      <form
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        onSubmit={handleEnrollmentRequest}
      >
        <div style={{ position: "relative" }}>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "1.5px solid #4b3c70",
              fontSize: "1rem",
              background: "#fff",
              color: "#000",
              fontWeight: 500,
              minWidth: "160px",
              transition: "background 0.2s",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">Select Course</option>
            {availableCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName} ({course.courseId})
              </option>
            ))}
          </select>
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "1.5px solid #4b3c70",
              fontSize: "1rem",
              background: selectedBatch ? " #ffffff" : " #f5f6fa",
              color: selectedBatch ? " #000000" : " #000000",
              fontWeight: 500,
              minWidth: "160px",
              transition: "background 0.2s",
              outline: "none",
              cursor: selectedCourse ? "pointer" : "not-allowed",
              opacity: selectedCourse ? 1 : 0.6,
            }}
            disabled={!selectedCourse}
          >
            <option value="">Select Batch</option>
            {availableBatches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.batchId}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            background:
              selectedCourse && selectedBatch ? " #4b3c70" : " #a0a0a0",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "0.7rem 1.7rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: selectedCourse && selectedBatch ? "pointer" : "not-allowed",
            boxShadow: "0 2px 8px rgba(60,60,120,0.12)",
          }}
          disabled={!(selectedCourse && selectedBatch)}
        >
          Enroll
        </button>
      </form>
    </div>
  );
}