import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [attendanceProvided, setAttendanceProvided] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to add an event.");
      setLoading(false);
      return;
    }

    let imageUrl = "";

    // 🌤 Upload to Cloudinary (if image selected)
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "collegecart_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/du2zisnjw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        imageUrl = data.secure_url;
      } else {
        throw new Error("Image upload failed");
      }
    }

    // 📝 Save event data to Firestore
    await addDoc(collection(db, "events"), {
      title,
      description,
      date,
      time,
      location,
      imageUrl,
      attendanceProvided,
      timestamp: serverTimestamp(),
      createdBy: user.uid,           // ✅ track creator
      createdByEmail: user.email,    // ✅ optional for display
    });

    alert("🎉 Event added successfully!");

    // Reset form fields
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setImage(null);
    setAttendanceProvided(false);
  } catch (err) {
    console.error("Error adding event:", err);
    setError("Failed to add event. Check console for details.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="max-w-lg mx-auto p-6 mt-8 bg-purple-50 border border-purple-200 shadow-lg rounded-2xl animate-fadeIn"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
        ✨ Add New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Event Description"
          className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Time:
            </label>
            <input
              type="time"
              className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Event Image:
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-purple-200 rounded cursor-pointer"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div>
          <p className="font-medium mb-1 text-gray-700">Attendance Provided?</p>
          <div className="flex gap-4">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value="yes"
                checked={attendanceProvided === true}
                onChange={() => setAttendanceProvided(true)}
              />{" "}
              Yes
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value="no"
                checked={attendanceProvided === false}
                onChange={() => setAttendanceProvided(false)}
              />{" "}
              No
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-[1.02]"
        >
          {loading ? "Adding Event..." : "Add Event"}
        </button>

        {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
}
