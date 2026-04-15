import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext"; // 🔹 get current user

import SkillSidebar from "../components/SkillSidebar";
import SkillForm from "../components/SkillForm";
import SkillCard from "../components/SkillCard";

export default function SkillExchange() {
  const { user } = useAuth(); // 🔹 current logged-in user
  const [active, setActive] = useState("browse");
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    const snapshot = await getDocs(collection(db, "skills"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSkills(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-purple-200">
          {/* 🌟 Navbar on top */}
          <Navbar />
    <div className="flex min-h-screen bg-gray-50">
      
      
      <SkillSidebar onSelect={setActive} active={active} />

      <div className="flex-1 p-6">
        {/* Add Skill */}
        {active === "add" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-purple-700">Add Skill</h1>
            <SkillForm onPostAdded={fetchSkills} />
          </>
        )}

        {/* Browse Skills */}
        {active === "browse" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-purple-700">Browse Skills</h1>

            {skills.length === 0 ? (
              <p className="text-gray-600">No skills yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onDelete={fetchSkills} />
                ))}
              </div>
            )}
          </>
        )}

        {/* My Skills */}
        {active === "my" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-purple-700">My Skills</h1>

            {!user ? (
              <p className="text-gray-600">Please login to see your skills.</p>
            ) : skills.filter((skill) => skill.userId === user.uid).length === 0 ? (
              <p className="text-gray-600">You haven’t added any skills yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter((skill) => skill.userId === user.uid)
                  .map((skill) => (
                    <SkillCard key={skill.id} skill={skill} onDelete={fetchSkills} />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
     </div>
  );
}
