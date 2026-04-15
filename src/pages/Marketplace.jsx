// src/pages/Marketplace.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // for hamburger menu

export default function Marketplace() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
      isActive
        ? "bg-white text-purple-700"
        : "text-purple-800 hover:bg-purple-200"
    } transition`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🌟 Navbar */}
      <header className="bg-purple-700 text-white flex justify-between items-center px-4 md:px-6 py-3 shadow">
        <div className="flex items-center gap-4 md:gap-10">
          <h1 className="text-xl md:text-2xl font-bold">CollegeCart+</h1>

          {/* 🌐 Desktop Nav */}
          <nav className="hidden md:flex gap-6 font-medium">
            <NavLink to="/marketplace" className="hover:underline">
              Marketplace
            </NavLink>
            <NavLink to="/materials" className="hover:underline">
              Study Materials
            </NavLink>
            <NavLink to="/skills" className="hover:underline">
              Skill Exchange
            </NavLink>
            <NavLink to="/lost-found" className="hover:underline">
              Lost & Found
            </NavLink>
            <NavLink to="/events" className="hover:underline">
              Events
            </NavLink>
            <NavLink to="/wellness" className="hover:underline">
              Wellness
            </NavLink>
          </nav>

          {/* 📱 Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {user && (
            <span className="hidden sm:block bg-white text-purple-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              {user.email}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-white text-purple-700 px-2 md:px-3 py-1 rounded-md text-sm md:text-base font-semibold hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 📱 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="bg-purple-600 text-white flex flex-col md:hidden px-4 py-3 space-y-2">
          <NavLink to="/marketplace" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Marketplace
          </NavLink>
          <NavLink to="/materials" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Study Materials
          </NavLink>
          <NavLink to="/skill-exchange" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Skill Exchange
          </NavLink>
          <NavLink to="/lost-found" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Lost & Found
          </NavLink>
          <NavLink to="/events" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Events
          </NavLink>
          <NavLink to="/wellness" className="hover:underline" onClick={() => setMenuOpen(false)}>
            Wellness
          </NavLink>
        </div>
      )}

      {/* 🧭 Sidebar + Main */}
      <div className="flex flex-1">
        {/* 📱 Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden bg-purple-600 text-white p-2 m-2 rounded-md fixed bottom-4 right-4 shadow-lg z-50"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* 🧭 Sidebar */}
        <aside
          className={`${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } fixed md:static top-0 left-0 w-64 bg-purple-100 p-4 border-r transition-transform duration-300 z-40 min-h-screen md:min-h-0`}
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            🛍️ Marketplace Dashboard
          </h2>

          <nav className="space-y-2">
            <NavLink
              to="add"
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              ➕ Add Item
            </NavLink>
            <NavLink
              to="view"
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              📦 View Items
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 mt-12 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
