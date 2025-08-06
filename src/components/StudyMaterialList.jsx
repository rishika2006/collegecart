import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ImageUpload from '../components/ImageUpload';
const StudyMaterialList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'studyMaterials'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📚 Study Materials</h2>
      {materials.map((material) => (
        <div key={material.id} className="p-4 border mb-2 rounded">
          <h3 className="font-semibold">{material.title}</h3>
          <a
            href={material.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View / Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default StudyMaterialList;
