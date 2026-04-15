import React from "react";

export default function SkillSidebar({ onSelect, active }) {
  const options = [
    { id: "add", label: "Add Skill" },
    { id: "browse", label: "Browse Skills" },
    { id: "my", label: "My Skills" },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">Skill Exchange</h2>
      <nav className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`text-left px-4 py-2 rounded-md font-medium ${
              active === opt.id
                ? "bg-purple-600 text-white"
                : "text-purple-700 hover:bg-purple-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
