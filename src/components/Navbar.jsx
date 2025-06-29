import React, { useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import mode from '../functions.js';

const Navbar = ({ currentUser, cartCount, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigate = useNavigate();

  return (
    <nav className="bg-green-600 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <NavLink to="/" className="text-white text-xl font-bold">
          Amazon Clone
        </NavLink>

        {/* Username */}
        {currentUser?.username && (
          <span className=" text-white font-semibold text-lg uppercase ml-4">
           Hello, {currentUser.username}
          </span>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-blue-200 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Menu Links */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto`}>
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
            {/* Home */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                  ${isActive ? 'font-semibold text-blue-300' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>

            {/* About */}
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                  ${isActive ? 'font-semibold text-blue-300' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
            </li>

            {/* Contact */}
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                  ${isActive ? 'font-semibold text-blue-300' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            {/* Conditional: User Logged In */}
            {currentUser ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                      ${isActive ? 'font-semibold text-blue-300' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                      navigate("/");
                    }
                  }
                    className="block px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                      ${isActive ? 'font-semibold text-blue-300' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
                      ${isActive ? 'font-semibold text-blue-300' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}

            {/* Cart */}
            <li className="relative">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `inline-block px-4 py-2 border border-white  sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition relative 
                  ${isActive ? 'font-semibold text-blue-300' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Theme Toggle */}
            <li>
              <button
                onClick={mode}
                className="block px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
              >
                Mode
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
