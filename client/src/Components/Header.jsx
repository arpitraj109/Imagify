import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
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
      className="flex flex-col items-center text-center mt-20 px-4"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-6 py-1 rounded-full shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p className="text-sm font-medium">Text to Image Generator</p>
        <img src={assets.star_icon} alt="Star" className="w-4 h-4" />
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold mt-10 text-gray-800 leading-tight max-w-[800px]"
      >
        Text to <span className="text-blue-600">Image</span> In Seconds..
      </motion.h1>

      <motion.p
        className="text-lg text-gray-500 max-w-2xl mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Bring your ideas to life with our powerful AI-driven text-to-image generator. Simply describe what you envision, and watch as your words transform into breathtaking artwork, realistic scenes, or anything you dream of.
      </motion.p>

      <motion.button
        onClick={onClickHandler}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-3 hover:bg-blue-700 transition duration-300 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Generate Images
        <img src={assets.star_group} alt="Star group" className="h-5" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex flex-wrap justify-center mt-16 gap-4"
      >
        {Array(6).fill('').map((_, index) => (
          <motion.img
            whileHover={{ scale: 1.05 }}
            key={index}
            src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
            alt="Sample"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow hover:shadow-lg transition-all cursor-pointer"
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-4 text-gray-500"
      >
        Generate Images from <span className="font-semibold text-blue-600">Imaget</span>
      </motion.p>
    </motion.div>
  )
}

export default Header
