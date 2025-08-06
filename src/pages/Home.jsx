// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const Home = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().fullName || user.email);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      
      

      <Navbar userName={userName} />
      <div className="flex">
        
        <main className="p-6">
          <h2 className="text-2xl font-bold text-purple-800">🏡 Home Dashboard</h2>
          <p className="mt-2">Welcome to your CollegeCart+ portal!</p>
        </main>
      </div>
    </div>
  );
};

export default Home;
