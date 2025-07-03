// import React, { useState } from 'react';
// import { useNavigate, NavLink } from 'react-router-dom';
// import mode from '../functions.js';

// const Navbar = ({ currentUser, cartCount, handleLogout }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-green-600 shadow-md">
//       <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
//         {/* Logo */}
//         <NavLink to="/" className="text-white text-xl font-bold">
//           Amazon Clone
//         </NavLink>

//         {/* Username */}
//         {currentUser?.username && (
//           <span className=" text-white font-semibold text-lg uppercase ml-4">
//             Hello, {currentUser.username}
//           </span>
//         )}

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={toggleMenu}
//           className="md:hidden text-white hover:text-blue-200 focus:outline-none"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Menu Links */}
//         <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto`}>
//           <ul className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
//             {/* Home */}
//             <li>
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                   ${isActive ? 'font-semibold text-blue-300' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </NavLink>
//             </li>

//             {/* About */}
//             <li>
//               <NavLink
//                 to="/about"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                   ${isActive ? 'font-semibold text-blue-300' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </NavLink>
//             </li>

//             {/* Contact */}
//             <li>
//               <NavLink
//                 to="/contact"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                   ${isActive ? 'font-semibold text-blue-300' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </NavLink>
//             </li>

//             {/* Conditional: User Logged In */}
//             {currentUser ? (
//               <>
//                 <li>
//                   <NavLink
//                     to="/profile"
//                     className={({ isActive }) =>
//                       `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                       ${isActive ? 'font-semibold text-blue-300' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Profile
//                   </NavLink>
//                 </li>
//                 <li className=' md:w-auto sm:w-auto'>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                       navigate("/");
//                     }
//                     }
//                     className="block px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition "
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li>
//                   <NavLink
//                     to="/login"
//                     className={({ isActive }) =>
//                       `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                       ${isActive ? 'font-semibold text-blue-300' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Login
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/signup"
//                     className={({ isActive }) =>
//                       `block px-4 py-2 text-white rounded-md hover:text-blue-200 transition 
//                       ${isActive ? 'font-semibold text-blue-300' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Signup
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* Cart */}
//             <li className="relative p-1">
//               <NavLink
//                 to="/cart"
//                 className={({ isActive }) =>
//                   `inline-block px-4 py-2 border border-white  sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition relative 
//                   ${isActive ? 'font-semibold text-blue-300' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Cart
//                 {cartCount > 0 && (
//                   <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
//                     {cartCount}
//                   </span>
//                 )}
//               </NavLink>
//             </li>

//             {/* Theme Toggle */}
//             <li className=''>
//               <button
//                 onClick={mode}
//                 className="block px-2 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
//               >
//                 Mode
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// 03/07/2025
// import React, { useState } from 'react';
// import { useNavigate, NavLink } from 'react-router-dom';
// import mode from '../functions.js';

// const Navbar = ({ currentUser, cartCount, handleLogout }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md w-full">
//       <div className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between px-4 py-3">

//         {/* Logo */}
//         <NavLink to="/" className="text-white text-xl font-bold">
//           Amazon Clone
//         </NavLink>

//         {/* Username */}
//         {currentUser?.username && (
//           <span className="text-white font-semibold text-lg uppercase ml-4">
//             Hello, {currentUser.username}
//           </span>
//         )}

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={toggleMenu}
//           className="md:hidden text-white hover:text-blue-200 focus:outline-none"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Menu Links */}
//         <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto`}>
//           <ul className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">

//             {/* Home */}
//             <li className="w-full md:w-auto">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                   ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </NavLink>
//             </li>

//             {/* About */}
//             <li className="w-full md:w-auto">
//               <NavLink
//                 to="/about"
//                 className={({ isActive }) =>
//                   `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                   ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </NavLink>
//             </li>

//             {/* Contact */}
//             <li className="w-full md:w-auto">
//               <NavLink
//                 to="/contact"
//                 className={({ isActive }) =>
//                   `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                   ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </NavLink>
//             </li>

//             {/* Conditional Rendering: Logged In */}
//             {currentUser ? (
//               <>
//                 <li className="w-full md:w-auto">
//                   <NavLink
//                     to="/profile"
//                     className={({ isActive }) =>
//                       `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                       ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Profile
//                   </NavLink>
//                 </li>
//                 <li className="w-full md:w-auto">
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                       navigate("/");
//                     }}
//                     className="w-full text-center px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="w-full md:w-auto">
//                   <NavLink
//                     to="/login"
//                     className={({ isActive }) =>
//                       `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                       ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Login
//                   </NavLink>
//                 </li>
//                 <li className="w-full md:w-auto">
//                   <NavLink
//                     to="/signup"
//                     className={({ isActive }) =>
//                       `block w-full text-center px-4 py-2 text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
//                       ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                     }
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Signup
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {/* Cart */}
//             <li className="relative w-full md:w-auto p-1">
//               <NavLink
//                 to="/cart"
//                 className={({ isActive }) =>
//                   `block w-full text-center px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium relative
//                   ${isActive ? 'bg-green-500 text-blue-600' : ''}`
//                 }
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Cart
//                 {cartCount > 0 && (
//                   <span className="absolute top-0 right-3 transform translate-x-1 -translate-y-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
//                     {cartCount}
//                   </span>
//                 )}
//               </NavLink>
//             </li>

//             {/* Theme Toggle */}
//             <li className="w-full md:w-auto">
//               <button
//                 onClick={mode}
//                 className="w-full text-center px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium"
//               >
//                 Mode
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// updated on 03/07/2025
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import mode from '../functions.js';

const Navbar = ({ currentUser, cartCount, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md w-full">
      <div className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between px-4 py-3">

        {/* Logo */}
        <NavLink to="/" className="text-white text-xl font-bold">
          Amazon Clone
        </NavLink>

        {/* Username */}
        {currentUser?.username && (
          <span className="text-white font-semibold text-base sm:text-lg uppercase ml-4">
            Hello, {currentUser.username}
          </span>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-blue-200 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Menu Links */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 w-full md:flex md:items-center md:w-auto`}>
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">

            {/* Home */}
            <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                  ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>

            {/* About */}
            <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                  ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
            </li>

            {/* Contact */}
            <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                  ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            {/* Conditional Rendering: Logged In */}
            {currentUser ? (
              <>
                <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                      ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                      navigate("/");
                    }}
                    className="block w-full text-center px-4 py-2 text-sm sm:text-base text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                      ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block text-center px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium
                      ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}

            {/* Cart */}
            <li className="relative w-full sm:w-3/4 md:w-auto lg:w-auto p-1">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `block text-center px-4 py-2 text-sm sm:text-base text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium relative
                  ${isActive ? 'bg-green-500 text-blue-600' : ''}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 right-3 transform translate-x-1 -translate-y-2 flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 text-xs sm:text-sm font-bold text-white bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Theme Toggle */}
            <li className="w-full sm:w-3/4 md:w-auto lg:w-auto">
              <button
                onClick={mode}
                className="block w-full text-center px-4 py-2 text-sm sm:text-base text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition font-medium"
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
