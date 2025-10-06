import React, { useState } from "react";

export default function MentalWellness() {
  const [thought, setThought] = useState("");
  const [posts, setPosts] = useState([
    { text: "Feeling stressed before exams 😔", time: "2 hrs ago" },
    { text: "Take small steps, it gets better 💙", time: "5 hrs ago" },
  ]);

  const handlePost = () => {
    if (!thought.trim()) return;
    setPosts([{ text: thought, time: "Just now" }, ...posts]);
    setThought("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 p-6">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-800">
          🌿 Mental Wellness Corner
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          A safe place for students to share thoughts, feel supported, and stay motivated.
        </p>
      </div>

      {/* Anonymous Sharing Box */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Share Your Thoughts (Anonymous)
        </h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
          rows="3"
          placeholder="Write something you want to share..."
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
        <button
          onClick={handlePost}
          className="mt-3 px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          Post Anonymously
        </button>
      </div>

      {/* Recent Posts */}
      <div className="max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">
              <p className="text-gray-800">{post.text}</p>
              <span className="text-sm text-gray-500">{post.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Tips */}
      <div className="max-w-3xl mx-auto bg-indigo-50 p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-bold text-indigo-700">✨ Motivational Tips</h2>
        <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
          <li>Take short breaks during study sessions 📝</li>
          <li>Talk to friends or family when feeling low ❤️</li>
          <li>Exercise or meditate for 15 minutes daily 🧘</li>
          <li>Celebrate small achievements 🎉</li>
          <li>Remember: It’s okay to ask for help 🤝</li>
        </ul>
      </div>

      {/* Resources */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-bold text-indigo-700 mb-3">📌 Helpful Resources</h2>
        <p className="text-gray-600">
          Need urgent help? Reach out to a counselor or call{" "}
          <a
            href="https://www.vandrevalafoundation.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium underline"
          >
            Vandrevala Foundation Helpline
          </a>
        </p>
      </div>
    </div>
  );
}
