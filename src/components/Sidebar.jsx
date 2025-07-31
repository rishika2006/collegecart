// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // install lucide-react

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const links = ["Marketplace", "Study Materials", "Skill Exchange", "Lost & Found", "Events", "Wellness"];

  return (
    <div className="relative">
      <button className="sm:hidden p-2" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
      <aside className={`sm:block ${open ? 'block' : 'hidden'} absolute sm:relative bg-purple-100 sm:bg-transparent p-4 sm:p-0`}>
        <ul className="space-y-3 sm:flex sm:space-y-0 sm:space-x-6">
          {links.map((link) => (
            <li key={link} className="text-purple-700 hover:underline cursor-pointer">{link}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
