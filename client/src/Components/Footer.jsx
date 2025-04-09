import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="mt-24 border-t pt-6 px-4 sm:px-8 text-gray-500 text-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      
        <img src={assets.logo} alt="logo" width={140} className="opacity-90" />

        
        <p className="text-center sm:text-left sm:border-l sm:pl-6 sm:border-gray-300">
          © {new Date().getFullYear()} Imagify. All rights reserved.
        </p>

        
        <div className="flex gap-4">
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.facebook_icon} alt="Facebook" width={28} />
          </a>
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.twitter_icon} alt="Twitter" width={28} />
          </a>
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.instagram_icon} alt="Instagram" width={28} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
