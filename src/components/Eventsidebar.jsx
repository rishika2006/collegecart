import React from "react";
import { NavLink } from "react-router-dom";

export default function Eventsidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-100 transition ${
      isActive ? "bg-gray-200 font-semibold" : ""
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">CollegeCart+</h2>

      <nav className="space-y-2">
        {/* Dashboard / Home */}
        <NavLink to="/" className={linkClass}>
          🏠 Home
        </NavLink>

        {/* Events Section */}
        <NavLink to="/events" className={linkClass}>
          📅 All Events
        </NavLink>
        <NavLink to="/add-event" className={linkClass}>
          ➕ Add Event
        </NavLink>

        {/* Marketplace Section */}
        <NavLink to="/marketplace" className={linkClass}>
          🛍️ Marketplace
        </NavLink>

        {/* Lost & Found */}
        <NavLink to="/lost-found" className={linkClass}>
          🎒 Lost & Found
        </NavLink>

        {/* Study Materials */}
        <NavLink to="/materials" className={linkClass}>
          📚 Study Materials
        </NavLink>

        {/* Skill Exchange */}
        <NavLink to="/skills" className={linkClass}>
          🤝 Skill Exchange
        </NavLink>

        {/* Mental Wellness */}
        <NavLink to="/wellness" className={linkClass}>
          💬 Wellness Corner
        </NavLink>

        {/* Profile / Logout */}
        <NavLink to="/profile" className={linkClass}>
          👤 Profile
        </NavLink>
      </nav>
    </aside>
  );
}
