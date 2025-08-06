// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // ✅ create navigate instance

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // ✅ redirect to login page after logout
      })
      .catch(console.error);
  };

  const links = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Study Materials", path: "/study-material" },
    { name: "Skill Exchange", path: "/skill-exchange" },
    { name: "Lost & Found", path: "/lost-found" },
    { name: "Events", path: "/events" },
    { name: "Wellness", path: "/wellness" }
  ];

  return (
    <header className="w-full bg-purple-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-sm">
        {/* Logo and menu toggle */}
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold">🎓 CollegeCart+</h1>
          <button className="sm:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop nav links */}
        <div className="hidden sm:flex gap-4">
          {links.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className="hover:underline transition duration-200"
            >
              {name}
            </Link>
          ))}
        </div>

        {/* User info and sign out */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Hi, {currentUser?.email || "Student"}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 text-xs font-medium px-2 py-1 rounded hover:bg-purple-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {open && (
        <nav className="sm:hidden bg-purple-700 px-4 pb-3 text-sm">
          <ul className="space-y-2">
            {links.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className="block text-white hover:underline"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
