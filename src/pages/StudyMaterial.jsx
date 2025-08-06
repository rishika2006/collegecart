// src/pages/StudyMaterial.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import axios from 'axios';
import Navbar from '../components/Navbar';

const StudyMaterial = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]); // ✅ NEW: For full dataset
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchSubject, setSearchSubject] = useState(''); // ✅ NEW: For search input

  const cloudName = 'du2zisnjw';
  const uploadPreset = 'collegecart';

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !subject || !file) {
      alert('Please fill all fields and select a file.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      const fileUrl = res.data.secure_url;

      await addDoc(collection(db, 'studyMaterials'), {
        title,
        subject,
        url: fileUrl,
        timestamp: serverTimestamp(),
      });

      setTitle('');
      setSubject('');
      setFile(null);
      fetchMaterials(); // ✅ Refresh after upload
      alert('✅ Material uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'studyMaterials'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllMaterials(data); // ✅ Store all for search
      setMaterials(data);    // ✅ Initially show all
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Handle subject search
  const handleSearch = (value) => {
    setSearchSubject(value);

    const filtered = allMaterials.filter((mat) =>
      mat.subject.toLowerCase().includes(value.toLowerCase())
    );
    setMaterials(filtered);
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-100 to-purple-200">
      {/* Sidebar */}
      <div className="w-60 bg-white shadow-lg p-5 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          📚 Study Material
        </h2>
        <button
          className={`text-left px-4 py-2 rounded-md font-medium transition ${
            activeTab === 'upload'
              ? 'bg-purple-600 text-white'
              : 'hover:bg-purple-100'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Material
        </button>
        <button
          className={`text-left px-4 py-2 rounded-md font-medium transition ${
            activeTab === 'view'
              ? 'bg-purple-600 text-white'
              : 'hover:bg-purple-100'
          }`}
          onClick={() => setActiveTab('view')}
        >
          📁 View Materials
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Navbar />

        {/* Upload Form */}
        {activeTab === 'upload' && (
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
              📤 Upload Study Material
            </h1>
            <form onSubmit={handleUpload} className="space-y-5">
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="text"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full"
              />
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-all duration-300"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        )}

        {/* View Materials */}
        {activeTab === 'view' && (
          <div className="w-full max-w-6xl mx-auto mt-6 animate-fade-in-slow">
            <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
              📁 Uploaded Materials
            </h2>

            {/* 🔍 Search by Subject */}
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Search by Subject..."
                value={searchSubject}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {materials.length === 0 ? (
              <p className="text-center text-gray-600">No materials found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-white shadow-lg border border-purple-100 rounded-xl p-4 transition-transform hover:scale-105 duration-300"
                  >
                    <h3 className="text-lg font-semibold text-purple-800">
                      {mat.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Subject: {mat.subject}
                    </p>
                    <a
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View / Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          .animate-fade-in-slow {
            animation: fadeIn 1.2s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default StudyMaterial;
