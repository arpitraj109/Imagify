import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import axios from 'axios';
import { toast } from 'react-toastify';

const OTPVerification = ({ email, onVerificationComplete, onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const backendUrl = 'http://localhost:4000';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { email });
      if (data.success) {
        setTimer(600);
        toast.success('OTP sent successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter a valid OTP');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp: otpString
      });

      if (data.success) {
        toast.success('Email verified successfully');
        onVerificationComplete();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Verify Your Email</h1>
        <p className='text-sm text-center mt-2'>We've sent an OTP to {email}</p>

        <div className='flex justify-center gap-2 mt-6'>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type='text'
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl focus:border-blue-500 focus:outline-none'
              required
            />
          ))}
        </div>

        <div className='text-center mt-4'>
          <p className='text-sm text-gray-500'>
            Time remaining: {formatTime(timer)}
          </p>
          <button
            type='button'
            onClick={handleResendOTP}
            disabled={timer > 0}
            className={`text-sm mt-2 ${
              timer > 0 ? 'text-gray-400' : 'text-blue-600 hover:underline'
            }`}
          >
            Resend OTP
          </button>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-full mt-6'
        >
          Verify
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

export default OTPVerification; 