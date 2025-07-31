import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import registerImg from '../assets/register.jpg';

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password must be at least 6 characters"),
  college: yup.string().required("College name is required"),
  department: yup.string().required("Department is required"),
  year: yup.string().required("Year of study is required"),
  collegeId: yup.string().required("College ID is required"),
});

const Register = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: data.fullName,
        email: data.email,
        college: data.college,
        department: data.department,
        year: data.year,
        collegeId: data.collegeId,
        createdAt: new Date(),
      });
      console.log("✅ User created & data stored in Firestore:", data.email);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-yellow-200 to-purple-300 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-400 opacity-30 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-16 -right-10 w-96 h-96 bg-purple-400 opacity-30 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
      <motion.div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="md:w-1/2 hidden md:block h-full max-h-[800px]">
          <img
            src={registerImg}
            alt="Register"
            className="h-full w-full object-cover rounded-l-3xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 bg-white">
          <h2 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">Join <span className="text-pink-600">CollegeCart+</span></h2>

          {submitted && (
            <motion.div 
              className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              ✅ Registration successful!
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'fullName', label: 'Full Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'password', label: 'Password', type: 'password' },
              { name: 'college', label: 'College Name', type: 'text' },
              { name: 'department', label: 'Department', type: 'text' },
              { name: 'collegeId', label: 'College ID', type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  {...register(name)}
                  className="w-full mt-1 p-2 border-2 border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors[name] && (
                  <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Year of Study</label>
              <select
                {...register('year')}
                className="w-full mt-1 p-2 border-2 border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Select</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.year && <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </motion.button>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
  {/* All your input fields and submit button here */}
</form>

<p className="text-sm text-center mt-4 text-gray-700">
  Already have an account?{" "}
  <a href="/login" className="text-purple-600 hover:underline font-semibold">
    Sign In
  </a>
</p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;