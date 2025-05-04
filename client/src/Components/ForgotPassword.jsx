import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email });
      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative bg-white p-10 rounded-xl text-slate-500'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Forgot Password</h1>
        <p className='text-sm text-center mt-2'>Enter your email to receive a password reset link</p>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} alt="Email Icon" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            className='outline-none text-sm w-full'
            placeholder='Email Id'
            required
          />
        </div>

        <button 
          className='bg-blue-600 w-full text-white py-2 rounded-full mt-6 disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <img
          onClick={onClose}
          src={assets.cross_icon}
          alt="Close Icon"
          className='absolute top-5 right-5 cursor-pointer'
        />
      </motion.form>
    </div>
  );
};

export default ForgotPassword; 