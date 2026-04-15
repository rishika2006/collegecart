// src/components/AddItem.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("sell");
  const [contactInfo, setContactInfo] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Your Cloudinary details
  const cloudName = "du2zisnjw";
  const uploadPreset = "collegecart";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add an item!");
        setLoading(false);
        return;
      }

      let imageUrl = "";
      if (image) {
        // 🔹 Upload image to Cloudinary
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
        } else {
          throw new Error("Cloudinary upload failed");
        }
      }

      // 🔹 Save item data in Firestore
      await addDoc(collection(db, "marketplaceItems"), {
        itemName,
        description,
        price,
        type,
        contactInfo,
        imageUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setItemName("");
      setDescription("");
      setPrice("");
      setType("sell");
      setContactInfo("");
      setImage(null);
      setSuccess("✅ Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border p-2 rounded"
        ></textarea>

        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="sell"
              checked={type === "sell"}
              onChange={(e) => setType(e.target.value)}
            />
            <span>Sell</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="rent"
              checked={type === "rent"}
              onChange={(e) => setType(e.target.value)}
            />
            <span>Rent</span>
          </label>
        </div>

        <input
          type="text"
          placeholder="Contact Info (Email / Phone)"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>

      {success && <p className="text-green-600 mt-3">{success}</p>}
    </div>
  );
}
