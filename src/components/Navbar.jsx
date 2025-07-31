import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth).catch(console.error);
  };

  return (
    <nav className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">🎓 CollegeCart+</h1>
      <div className="flex gap-4 items-center">
        <span className="hidden sm:inline">
          Welcome, {currentUser?.email || 'Student'}!
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-purple-600 font-semibold px-3 py-1 rounded hover:bg-purple-100"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
