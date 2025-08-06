import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ImageUpload from '../components/ImageUpload';
const StudyMaterialUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault(); // 🔥 FIX: Prevent page refresh

    console.log("Form submitted");

    if (!title || !file) {
      console.log("Missing title or file");
      setError("Please provide both title and file.");
      return;
    }

    setLoading(true);
    try {
      const storageRef = ref(storage, `studyMaterials/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File uploaded. URL:", downloadURL);

      const docRef = await addDoc(collection(db, "studyMaterials"), {
        title,
        fileURL: downloadURL,
        timestamp: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);

      setSuccess(true);
      setTitle('');
      setFile(null);
      setError('');
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Upload Study Material</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Enter title"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {success && <p className="text-green-600 mt-2">✅ Material uploaded successfully!</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default StudyMaterialUpload;
