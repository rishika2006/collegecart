// src/pages/EventDashboard.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const EventDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-purple-50 border-r border-purple-200 p-5 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-purple-700 mb-4">
            🎉 Event Dashboard
          </h2>

          <Link
            to="/events/add"
            className={`p-2 rounded-md transition font-medium ${
              location.pathname === "/events/add"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-700 hover:bg-purple-200"
            }`}
          >
            ➕ Add Event
          </Link>

          <Link
            to="/events/all"
            className={`p-2 rounded-md transition font-medium ${
              location.pathname === "/events/all"
                ? "bg-purple-600 text-white shadow"
                : "text-purple-700 hover:bg-purple-200"
            }`}
          >
            📅 View Events
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventDashboard;
