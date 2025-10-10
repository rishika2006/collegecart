// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import StudyMaterial from './pages/StudyMaterial';
import ProtectedRoute from './components/ProtectedRoute';
import LostFound from "./pages/LostFound.jsx";
//import MentalWellness from "./pages/MentalWellness";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
     
      {/* Protected Routes with Sidebar */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <div className="flex">
             
              <Home />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lost-found"
        element={
          <ProtectedRoute>
            <div className="flex">
             
              <LostFound />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-material"
        element={
          <ProtectedRoute>
            
            <div className="flex">
              
              <StudyMaterial />
            </div>
          </ProtectedRoute>
        }
      />

      
    </Routes>
    
  );
};

export default App;
