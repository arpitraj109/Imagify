import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'

const GenerateButton = () => {
  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = () => {
    if (user) {
      navigate('/result')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="text-center py-16 px-4"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">
        See the Magic. <span className="text-blue-600">Try Now</span>
      </h1>

      <button
        onClick={onClickHandler}
        className="inline-flex items-center gap-3 px-10 py-3 bg-blue-600 text-white rounded-full font-medium text-lg shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
      >
        Generate Images
        <img src={assets.star_group} alt="star group" className="h-5" />
      </button>
    </motion.div>
  )
}

export default GenerateButton
