// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log("Auth State Changed:", user);
    setCurrentUser(user);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


return (
  <AuthContext.Provider value={{ currentUser }}>
    {loading ? <div className="text-center p-4">Loading...</div> : children}
  </AuthContext.Provider>
);


};
