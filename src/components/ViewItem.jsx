// src/components/ViewItem.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function ViewItem() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  // 🔹 Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "marketplaceItems"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // 🔹 Apply filters
  useEffect(() => {
    let filtered = items;

    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (item) => parseFloat(item.price) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (item) => parseFloat(item.price) <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.itemName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [filters, items]);

  // 🔹 Delete item
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "marketplaceItems", id));
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // 🔹 Edit item
  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditData({
      itemName: item.itemName,
      description: item.description,
      price: item.price,
      contactInfo: item.contactInfo,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "marketplaceItems", id), editData);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, ...editData } : item
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading items...</p>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Marketplace Items
      </h2>

      {/* 🔍 Filter Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center sm:justify-start">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="border p-2 rounded w-1/2 sm:w-28"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="border p-2 rounded w-1/2 sm:w-28"
          />
        </div>

        <input
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded w-full sm:w-64"
        />

        <button
          onClick={() =>
            setFilters({ type: "all", minPrice: "", maxPrice: "", search: "" })
          }
          className="bg-gray-300 hover:bg-gray-400 px-3 py-2 rounded w-full sm:w-auto"
        >
          Reset
        </button>
      </div>

      {/* 🔹 Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No items match your filters.
          </p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-3 sm:p-4 flex flex-col justify-between"
            >
              {item.imageUrl && (
                <div className="flex justify-center mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="h-32 w-32 sm:h-36 sm:w-36 object-cover rounded-md"
                  />
                </div>
              )}

              {editingItem === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.itemName}
                    onChange={(e) =>
                      setEditData({ ...editData, itemName: e.target.value })
                    }
                    className="border p-2 rounded w-full text-sm"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full text-sm"
                  ></textarea>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="border p-2 rounded w-full text-sm"
                  />
                  <input
                    type="text"
                    value={editData.contactInfo}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        contactInfo: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold">
                      {item.itemName}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                    <p className="mt-2 font-semibold text-gray-800">
                      ₹{item.price}
                    </p>
                    <p className="text-xs text-blue-600 uppercase">
                      {item.type === "rent" ? "For Rent" : "For Sale"}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      Contact: {item.contactInfo}
                    </p>
                  </div>

                  {auth.currentUser &&
                    auth.currentUser.uid === item.createdBy && (
                      <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm w-full sm:w-auto"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
