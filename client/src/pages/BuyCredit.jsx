import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/Appcontext'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const BuyCredit = () => {
  const { user, backendUrl, loadCreditData, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const initPay = async (order) => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded')
      toast.error('Payment system not available')
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verify-razor',
            response,
            { headers: { token } }
          )
          if (data.success) {
            loadCreditData()
            navigate('/')
            toast.success('Credits Added Successfully!')
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message)
        }
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const paymentRazorpay = async (planId) => {
    if (!user) {
      setShowLogin(true)
      return
    }

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/pay-razor',
        { planId },
        { headers: { token } }
      )

      if (data.success) {
        initPay(data.order)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10 px-4"
    >
      <h1 className="text-3xl font-semibold mb-6 sm:mb-10">Choose the Plan</h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-xl py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500 w-72 sm:w-80"
          >
            <img width={40} src={assets.logo_icon} alt="Plan Icon" />
            <p className="mt-4 font-semibold">{item.id}</p>
            <p className="text-sm text-gray-500">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span>
              <span className="text-gray-500 text-sm ml-2">/ {item.credits} credits</span>
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5"
            >
              {user ? 'Purchase' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
