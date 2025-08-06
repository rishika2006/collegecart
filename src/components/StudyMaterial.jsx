import React from 'react';
import StudyMaterialUpload from '../components/StudyMaterialUpload';
import StudyMaterialList from '../components/StudyMaterialList';
import ImageUpload from '../components/ImageUpload';
const StudyMaterial = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <StudyMaterialUpload />
      <StudyMaterialList />
    </div>
  );
};

export default StudyMaterial;
