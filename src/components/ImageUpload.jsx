import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "collegecart"); // Your preset name

    setUploading(true);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/du2zisnjw/image/upload", // Your cloud name
        formData
      );
      const imageUrl = res.data.secure_url;
      setPreview(imageUrl);
      onUpload(imageUrl); // Pass URL back to parent
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />

      {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}

      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-full border" />
          <p className="text-xs text-gray-600 mt-1">Image uploaded</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
