import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import loginImg from '../assets/register.jpg'; // reuse image
import { useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();

  const [loginSuccess, setLoginSuccess] = useState(false);
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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("✅ Login successful:", data.email);
      setLoginSuccess(true);
reset();
setTimeout(() => {
  setLoginSuccess(false);
  navigate("/home"); // ✅ Redirect after login
}, 1500);

    } catch (error) {
      console.error("❌ Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-yellow-400 opacity-30 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-16 -right-10 w-96 h-96 bg-purple-400 opacity-30 rounded-full mix-blend-multiply blur-3xl animate-pulse"></div>

      <motion.div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        <div className="md:w-1/2 hidden md:block h-full max-h-[800px]">
          <img
            src={loginImg}
            alt="Login"
            className="h-full w-full object-cover rounded-l-3xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 bg-white">
          <h2 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">Welcome Back to <span className="text-pink-600">CollegeCart+</span></h2>

          {loginSuccess && (
            <motion.div 
              className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              ✅ Logged in successfully!
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full mt-1 p-2 border-2 border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full mt-1 p-2 border-2 border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-700">
  Don't have an account?{" "}
  <a href="/register" className="text-pink-600 hover:underline font-semibold">
    Register Now
  </a>
</p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
