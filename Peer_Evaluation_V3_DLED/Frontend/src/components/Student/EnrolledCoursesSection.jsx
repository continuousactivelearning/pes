import React from "react";

export default function EnrolledCoursesSection({ enrolledCourses }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 190,
        maxWidth: 500,
        borderRadius: "18px",
        padding: "2rem 2.5rem",
        border: "1.5px solid #4b3c70",
        boxShadow: "0 4px 12px #4b3c70",
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
        Enrolled Courses
      </h3>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: " #4b3c70 transparent",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 5 }}>
          {enrolledCourses.length === 0 ? (
            <li style={{ fontStyle: "italic" }}>No enrolled courses found.</li>
          ) : (
            enrolledCourses.map((item, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.85rem 1.2rem",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px #4b3c70",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: " #2d3559",
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.courseName}</span>
                <span
                  style={{
                    color: "#fff",
                    background: " #4b3c70",
                    borderRadius: "6px",
                    padding: "0.3rem 1rem",
                    fontWeight: 500,
                    fontSize: "0.98rem",
                  }}
                >
                  Batch: {item.batchName}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
