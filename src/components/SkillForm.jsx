import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // adjust if your AuthContext path differs

const SkillForm = ({ onPostAdded }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("teach");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to post a skill!");

    setLoading(true);
    try {
      await addDoc(collection(db, "skills"), {
        title,
        description,
        type,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setDescription("");
      setType("teach");
      onPostAdded(); // refresh list
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Add a Post</h2>

      <input
        type="text"
        placeholder="Title (e.g., Learn React or Need project partner)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mb-3 border border-gray-300 rounded-md p-2"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full mb-3 border border-gray-300 rounded-md p-2"
        rows="3"
      ></textarea>

      <div className="flex items-center gap-4 mb-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="teach"
            checked={type === "teach"}
            onChange={(e) => setType(e.target.value)}
          />
          Teach
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="learn"
            checked={type === "learn"}
            onChange={(e) => setType(e.target.value)}
          />
          Learn
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="collab"
            checked={type === "collab"}
            onChange={(e) => setType(e.target.value)}
          />
          Collaborate
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md w-full"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default SkillForm;
