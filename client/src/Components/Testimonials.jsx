import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'motion/react'

const Testimonials = () => {
  return (
    <motion.section
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-20 py-12 px-6"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-2">
        Customer Testimonials
      </h1>
      <p className="text-gray-500 mb-12 text-center">What Our Users Are Saying</p>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {testimonialsData.map((testimonial, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white/30 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-md w-full sm:w-[22rem] md:w-[20rem] hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={testimonial.image}
                alt={`${testimonial.name} avatar`}
                className="rounded-full w-16 h-16 object-cover mb-3"
              />
              <h2 className="text-lg font-semibold text-neutral-800">{testimonial.name}</h2>
              <p className="text-sm text-gray-500">{testimonial.role}</p>

              <div className="flex gap-1 my-3">
                {Array(testimonial.stars)
                  .fill()
                  .map((_, starIndex) => (
                    <img
                      key={starIndex}
                      src={assets.rating_star}
                      alt="Star"
                      className="w-4 h-4"
                    />
                  ))}
              </div>

              <p className="text-sm text-gray-600">{testimonial.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default Testimonials
