import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function TAPanel({
  taBatchInfo,
  selectedTABatch,
  setSelectedTABatch,
  sectionHeading,
  handleTAManageClick,
  showTAManageOverlay,
  closeTAManageOverlay,
  pendingEnrollments,
  flaggedEvaluations,
  acceptEnrollment,
  declineEnrollment,
}) {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "#2d3559",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center" }}>
        <h2
          style={{
            ...sectionHeading,
            marginTop: 0,
            marginBottom: "2rem",
            textAlign: "center",
            color: "#3f3d56",
          }}
        >
          TA Panel
        </h2>
      </div>
      {/* Filter Dropdown */}
      <div style={{ marginBottom: "1rem", alignItems: "left", width: "100%" }}>
        <label style={{ fontSize: "1rem", fontWeight: 500, textAlign: "left" }}>
          Filter by Batch/Course:{" "}
        </label>
        <select
          value={selectedTABatch || ""}
          onChange={(e) => setSelectedTABatch(e.target.value)}
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
          {taBatchInfo &&
            taBatchInfo.map((assignment, idx) => (
              <option key={idx} value={assignment.batchId}>
                {assignment.courseName} - {assignment.batchId}
              </option>
            ))}
        </select>
      </div>
      {/* Table */}
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
            <th style={{ padding: "12px", textAlign: "center" }}>
              Course Name
            </th>
            <th style={{ padding: "12px", textAlign: "center" }}>Course ID</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Batch ID</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Instructor</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taBatchInfo && taBatchInfo.length > 0 ? (
            (selectedTABatch
              ? taBatchInfo.filter((a) => a.batchId === selectedTABatch)
              : taBatchInfo
            ).map((assignment, idx) => (
              <tr key={idx}>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {assignment.courseName}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {assignment.courseId}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {assignment.batchId}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {assignment.instructorName}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  <button
                    onClick={() => handleTAManageClick(assignment)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#4b3c70",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                Loading your assigned TA batch info...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Manage Overlay */}
      {showTAManageOverlay && (
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
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              width: "90%",
              maxWidth: "1700px",
              height: "90%",
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Pending Enrollments */}
            <div style={{ flex: 1 }}>
              <h3>Pending Enrollments</h3>
              {pendingEnrollments.length > 0 ? (
                <div
                  style={{
                    maxHeight: "300px", // Set a maximum height for the table container
                    overflowY: "auto", // Enable vertical scrolling
                    border: "1px solid #ddd", // Add a border for better visibility
                    borderRadius: "8px",
                  }}
                >
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
                        <th style={{ padding: "12px", textAlign: "center" }}>
                          Name
                        </th>
                        <th style={{ padding: "12px", textAlign: "center" }}>
                          Email ID
                        </th>
                        <th style={{ padding: "12px", textAlign: "center" }}>
                          Status
                        </th>
                        <th style={{ padding: "12px", textAlign: "center" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingEnrollments.map((enrollment, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              fontWeight: 500,
                            }}
                          >
                            {enrollment.student.name}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              fontWeight: 500,
                            }}
                          >
                            {enrollment.student.email}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              fontWeight: 500,
                            }}
                          >
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              fontWeight: 500,
                              display: "flex",
                              justifyContent: "center",
                              gap: "1rem",
                            }}
                          >
                            <button
                              onClick={() => acceptEnrollment(enrollment._id)}
                              style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <FaCheck style={{ fontSize: "1rem" }} />
                            </button>
                            <button
                              onClick={() => declineEnrollment(enrollment._id)}
                              style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#fc1717",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <FaTimes style={{ fontSize: "1rem" }} />
                            </button>
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

            {/* Right Column: Flagged Evaluations */}
            <div style={{ flex: 1 }}>
              <h3>Flagged Evaluations</h3>
              {/* Placeholder for flagged evaluations */}
            </div>

            {/* Close Button */}
            <button
              onClick={closeTAManageOverlay}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: " #fc1717",
                color: "#fff",
                fontWeight: 200,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <FaTimes style={{ fontSize: "1rem" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
