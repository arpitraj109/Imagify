import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-8 shadow-sm border-b">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-28 sm:w-32 lg:w-40" />
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Credit Button */}
            <button
              onClick={() => navigate('/buy')}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
            >
              <img src={assets.credit_star} alt="credit" className="w-5" />
              <span>Credits Left: {credit}</span>
            </button>

            {/* Greeting */}
            <p className="text-gray-700 max-sm:hidden">Hi, {user.name}</p>

            {/* Profile + Dropdown */}
            <div className="relative group">
              <img src={assets.profile_icon} alt="profile" className="w-10 cursor-pointer" />
              <div className="absolute hidden group-hover:block right-0 pt-12 z-10">
                <ul className="bg-white border rounded shadow-md text-sm text-gray-800 py-2 w-32">
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 sm:gap-6">
            <p
              onClick={() => navigate('/buy')}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition"
            >
              Pricing
            </p>
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowLogin(true)
              }}
              className="bg-black text-white px-6 sm:px-10 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
