import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:4000';
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        newPassword
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate('/');
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
    <div className='min-h-screen flex items-center justify-center px-4'>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='bg-white p-10 rounded-xl text-slate-500 w-full max-w-md'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Reset Password</h1>
        <p className='text-sm text-center mt-2'>Enter your new password</p>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt="Lock Icon" />
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            type='password'
            className='outline-none text-sm w-full'
            placeholder='New Password'
            required
          />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt="Lock Icon" />
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type='password'
            className='outline-none text-sm w-full'
            placeholder='Confirm Password'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-2 rounded-full mt-6 disabled:bg-blue-400'
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </motion.form>
    </div>
  );
};

export default ResetPassword; 