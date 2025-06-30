import React from "react";
import { Link, useLocation } from "react-router-dom";

const TeacherSidebar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/teacher" },
    { name: "Courses", path: "/teacher/courses" },
    { name: "Escalated Tickets", path: "/teacher/tickets" }, // ✅ New link
  ];

  return (
    <div className="w-64 min-h-screen bg-purple-700 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Teacher Panel</h2>
      <ul className="space-y-2">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded hover:bg-purple-800 ${
                location.pathname === link.path ? "bg-purple-900" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherSidebar;
