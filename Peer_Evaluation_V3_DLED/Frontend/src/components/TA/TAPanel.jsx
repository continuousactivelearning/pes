import React, { useState, useEffect } from "react";
import ManageOverlay from "./TAManageOverlay";

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
  selectedTAExam,
  setSelectedTAExam,
  TAEditEval,
  TAFlagEval,
  TADelEval,
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
          boxShadow: "0 4px 12px #4b3c70",
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
        <ManageOverlay
          showTAManageOverlay={showTAManageOverlay}
          closeTAManageOverlay={closeTAManageOverlay}
          pendingEnrollments={pendingEnrollments}
          flaggedEvaluations={flaggedEvaluations}
          acceptEnrollment={acceptEnrollment}
          declineEnrollment={declineEnrollment}
          selectedTAExam={selectedTAExam}
          setSelectedTAExam={setSelectedTAExam}
          TAEditEval={TAEditEval}
          TAFlagEval={TAFlagEval}
          TADelEval={TADelEval}
        />
      )}
    </div>
  );
}
