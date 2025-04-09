import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

const Steps = () => {
  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-32 px-6 sm:px-12 max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800">How it works</h1>
        <p className="text-lg text-gray-500 mt-2">Transform Words Into Images</p>
      </div>

      <div className="space-y-5">
        {stepsData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-5 bg-white/30 backdrop-blur-md p-5 sm:p-6 border border-gray-200 shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-shadow"
          >
            <img src={item.icon} alt="Step icon" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">{item.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default Steps
