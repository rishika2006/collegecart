import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';


// Validation schema using Yup
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
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
  try {
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Step 2: Store extra user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      fullName: data.fullName,
      email: data.email,
      college: data.college,
      department: data.department,
      year: data.year,
      createdAt: new Date()
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="https://source.unsplash.com/600x800/?college,students"
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Register to CollegeCart+</h2>

          {submitted && (
            <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 border border-green-300 text-center">
              ✅ Registration successful!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">College Name</label>
              <input
                type="text"
                {...register('college')}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.college && <p className="text-red-500 text-sm">{errors.college.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Department</label>
              <input
                type="text"
                {...register('department')}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Year of Study</label>
              <select
                {...register('year')}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            
              {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
            </div>
              <div>
  <label className="block text-sm font-medium">College ID</label>
  <input
    type="text"
    {...register('collegeId')}
    className="w-full p-2 border border-gray-300 rounded"
  />
  {errors.collegeId && <p className="text-red-500 text-sm">{errors.collegeId.message}</p>}
</div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
