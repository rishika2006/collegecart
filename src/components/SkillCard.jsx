import React from "react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";



const SkillCard = ({ skill, onDelete }) => {
  const { user } = useAuth();
if (!skill || !skill.type) return null;
  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      await deleteDoc(doc(db, "skills", skill.id));
      onDelete();
    }
  };

  const badgeColor =
    skill.type === "teach"
      ? "bg-green-200 text-green-800"
      : skill.type === "learn"
      ? "bg-blue-200 text-blue-800"
      : "bg-yellow-200 text-yellow-800";

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{skill.title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${badgeColor}`}>
          {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
        </span>
      </div>

      <p className="text-gray-600 mt-2">{skill.description}</p>

      <p className="text-sm text-gray-400 mt-3">
        Posted by <span className="font-medium">{skill.userName}</span>
      </p>

      {user && user.uid === skill.userId && (
        <button
          onClick={handleDelete}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default SkillCard;
