// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext"; // adjust path if yours differs
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth(); // expects your AuthContext to return { user }
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // redirect to login page (adjust path if needed)
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed, check console.");
    }
  };

  const links = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Study Materials", path: "/materials" },
    { name: "Skill Exchange", path: "/skill-exchange" },
    { name: "Lost & Found", path: "/lost-found" },
    { name: "Events", path: "/events" },
    { name: "Planner", path: "/planner" },
  ];

  return (
    <header className="bg-purple-700 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left: logo */}
          <div className="flex items-center gap-3">
            {/* update logo path if you have one; if no logo, this img can be removed */}
            <img
              src="/logo.png"
              alt="CollegeCart+"
              className="w-10 h-10 object-contain rounded-full border border-white/30"
              onError={(e) => { e.currentTarget.style.display = "none"; }} 
            />
            <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-white/95">CollegeCart</span>
              <span className="ml-1 text-white">+</span>
            </Link>
          </div>

          {/* center: links (desktop) */}
          <nav className="hidden md:flex gap-6 flex-1 justify-center">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="text-sm md:text-base hover:text-purple-200 transition"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* right: user & mobile button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {user?.email && (
                <div className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-medium truncate max-w-[220px]">
                  {user.email}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-purple-700 px-3 py-1.5 rounded-md font-semibold hover:bg-white/90 transition text-sm"
              >
                Sign Out
              </button>
            </div>

            {/* mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-600/80 focus:outline-none"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile panel */}
      <div className={`md:hidden bg-purple-700/95 ${open ? "block" : "hidden"} px-4 pb-4`}>
        <nav className="flex flex-col gap-2 py-2">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded text-white hover:bg-purple-600/80"
            >
              {l.name}
            </Link>
          ))}

          <div className="mt-2 border-t border-white/10 pt-2">
            {user?.email && <div className="text-sm text-white/90 mb-2">{user.email}</div>}
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full bg-white text-purple-700 px-3 py-2 rounded-md font-semibold"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
