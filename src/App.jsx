// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import StudyMaterial from './pages/StudyMaterial';
import ProtectedRoute from './components/ProtectedRoute';
import LostFound from './pages/LostFound.jsx';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EventDashboard from './pages/EventDashboard'; // ✅ new layout file (sidebar container)

// Optional: import Navbar if you want a global top bar
// import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      {/* You can uncomment this if you have Navbar globally */}
      {/* <Navbar /> */}

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lost-found"
          element={
            <ProtectedRoute>
              <LostFound />
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-material"
          element={
            <ProtectedRoute>
              <StudyMaterial />
            </ProtectedRoute>
          }
        />

        {/* ---------------- EVENTS SECTION ---------------- */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventDashboard /> {/* ✅ Sidebar + nested routes */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/events/all" />} /> {/* default */}
          <Route path="all" element={<Events />} /> {/* ✅ View events */}
          <Route path="add" element={<AddEvent />} /> {/* ✅ Add event */}
        </Route>

        {/* Optional future section */}
        {/* <Route path="/wellness" element={<ProtectedRoute><MentalWellness /></ProtectedRoute>} /> */}

      </Routes>
    </>
  );
};

export default App;
