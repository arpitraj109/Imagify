import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Description = () => {
  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800">Create AI Images</h1>
        <p className="text-gray-500 text-base mt-2">Turn your imagination into visuals</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Image Section */}
        <img
          src={assets.sample_img_1}
          alt="AI Sample"
          className="w-full max-w-sm lg:max-w-md rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        />

        {/* Text Section */}
        <div className="text-left max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-neutral-900">
            Introducing the AI-Powered Text to Image Generator
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Unleash your creativity like never before! Our AI-Powered Text to Image Generator
            turns your words into stunning visuals instantly. Whether you're crafting art,
            designing concepts, or just exploring imagination, the possibilities are endless.
            Start typing and let the magic unfold.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Transform simple descriptions into breathtaking artwork with ease. From dreamy
            landscapes to futuristic designs, our advanced AI brings your visions to life.
            Whether you're a designer, storyteller, or just curious, this tool is your
            gateway to endless creativity. Let your words paint a masterpiece today!
          </p>
        </div>
      </div>
    </motion.section>
  )
}

export default Description
