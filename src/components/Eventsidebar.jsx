import React from "react";
import { NavLink } from "react-router-dom";

export default function Eventsidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-100 ${
      isActive ? "bg-gray-200 font-semibold" : ""
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">CollegeCart+</h2>
      <nav className="space-y-2">
        <NavLink to="/events" className={linkClass}>
          📅 All Events
        </NavLink>
        <NavLink to="/add-event" className={linkClass}>
          ➕ Add Event
        </NavLink>
        {/* add your other sidebar links here */}
      </nav>
    </aside>
  );
}
