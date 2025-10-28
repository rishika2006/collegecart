// src/pages/ViewEvents.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // For preview modal

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="animate-fade-in relative">
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">
        📅 Upcoming Events
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No events available.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-purple-100 shadow-sm w-64 sm:w-56 md:w-60 p-3 rounded-lg hover:shadow-md transition-transform hover:-translate-y-1"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-28 object-cover rounded-md mb-2 cursor-pointer"
                  onClick={() => setSelectedImage(event.imageUrl)} // 👈 Open preview on click
                />
              )}

              <h3 className="text-base font-semibold text-purple-700 truncate">
                {event.title}
              </h3>
              <p className="text-gray-600 text-xs line-clamp-2">
                {event.description}
              </p>

              <div className="mt-2 text-xs text-gray-700 space-y-1">
                <p>📍 <strong>Location:</strong> {event.location}</p>
                <p>🗓️ <strong>Date:</strong> {event.date}</p>
                <p>⏰ <strong>Time:</strong> {event.time}</p>
                <p>
                  🧾 <strong>Attendance:</strong>{" "}
                  {event.attendanceProvided ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🖼️ Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in"
          onClick={() => setSelectedImage(null)} // Close when clicked
        >
          <img
            src={selectedImage}
            alt="Full Preview"
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ViewEvents;
