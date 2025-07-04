// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-black text-white">
//       {/* Back to Top Button */}
//       <div className="text-center py-3 border-b border-gray-700">
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="text-sm font-medium text-gray-300 hover:text-white hover:underline transition"
//           aria-label="Scroll to top"
//         >
//           Back to Top
//         </button>
//       </div>

//       {/* Footer Content */}
//       <div className="max-w-7xl mx-auto  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//         {/* Column 1 */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Get to Know Us</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//            <li><NavLink to ="/contact" className="hover:text-white hover:underline">Careers</NavLink></li>
//            <li> <NavLink to ="/about" className="hover:text-white hover:underline">About Us</NavLink></li>
//            <li> <NavLink to ="/about" className="hover:text-white hover:underline">Investor Relations</NavLink></li>
//            <li> <NavLink to ="/about" className="hover:text-white hover:underline">Press Releases</NavLink></li>
//           </ul>
//         </div>

//         {/* Column 2 */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Make Money with Us</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li><a href="#" className="hover:text-white hover:underline">Sell products</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Sell on Amazon Business</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Become an Affiliate</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Advertise Your Products</a></li>
//           </ul>
//         </div>

//         {/* Column 3 */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Amazon Payment</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li><a href="#" className="hover:text-white hover:underline">Amazon Business Card</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Shop with Points</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Reload Your Balance</a></li>
//           </ul>
//         </div>

//         {/* Column 4 */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Let Us Help You</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li><a href="#" className="hover:text-white hover:underline">Your Account</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Your Orders</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Shipping Rates</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Returns & Replacements</a></li>
//             <li><a href="#" className="hover:text-white hover:underline">Help</a></li>
//           </ul>
//         </div>
//       </div>

//       <div className="border-t border-gray-700 py-6 relative"> {/* Added 'relative' positioning */}
//         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-sm text-gray-400">
//           <div className="flex flex-wrap justify-center gap-4 mb-3">
//             <a href="#" className="text-black">Conditions of Use</a>
//             <a href="#" className="text-black">Privacy Notice</a>
//             <a href="#" className="text-black">Interest-Based Ads</a>
//           </div>
//           <p className="text-xs text-black">
//             © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
//           </p>
//         </div>

//         {/* Logo at bottom right */}
//         {/* Adjusted positioning, size, and object-fit for the image */}
//         <div className="absolute bottom-4 right-4"> {/* Positioned absolutely to bottom right, with some padding */}
//           <img
//             src="/SM.png"
//             alt="Sebastian Macwan Logo"
//             className="h-10 w-auto object-contain  opacity-15  hover:opacity-40" // Set a fixed height, auto width, and object-contain to fit without distortion
//           />
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {

  // Function to scroll to the top when a NavLink is clicked
  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white">
      {/* Back to Top Button */}
      {/* This button retains its manual functionality */}
      <div className="text-center py-3 border-b border-gray-700">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm font-medium text-gray-300 hover:text-white hover:underline transition"
          aria-label="Scroll to top"
        >
          Back to Top
        </button>
      </div>

      {/* Footer Content */}
      {/* Added responsive padding px-4 for smaller screens */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {/* Added onClick to NavLink for auto-scroll */}
            <li><NavLink to="/contact" onClick={handleNavLinkClick} className="hover:text-white hover:underline">Careers</NavLink></li>
            <li><NavLink to="/about" onClick={handleNavLinkClick} className="hover:text-white hover:underline">About Us</NavLink></li>
            <li><NavLink to="/about" onClick={handleNavLinkClick} className="hover:text-white hover:underline">Investor Relations</NavLink></li>
            <li><NavLink to="/about" onClick={handleNavLinkClick} className="hover:text-white hover:underline">Press Releases</NavLink></li>
          </ul>
        </div>

        {/* Column 2 - External links, no auto-scroll needed unless converted to NavLink */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white hover:underline">Sell products</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Sell on Amazon Business</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Become an Affiliate</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Advertise Your Products</a></li>
          </ul>
        </div>

        {/* Column 3 - External links, no auto-scroll needed unless converted to NavLink */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Amazon Payment</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white hover:underline">Amazon Business Card</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Shop with Points</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Reload Your Balance</a></li>
          </ul>
        </div>

        {/* Column 4 - External links, no auto-scroll needed unless converted to NavLink */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white hover:underline">Your Account</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Your Orders</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Shipping Rates</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Returns & Replacements</a></li>
            <li><a href="#" className="hover:text-white hover:underline">Help</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-6 relative">
        {/* Added px-4 for horizontal padding on smaller screens */}
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-sm text-gray-400">
          {/* Adjusted text color for better visibility against dark background */}
          <div className="flex flex-wrap justify-center gap-4 mb-3 text-gray-300">
            <a href="#" className="hover:text-white hover:underline">Conditions of Use</a>
            <a href="#" className="hover:text-white hover:underline">Privacy Notice</a>
            <a href="#" className="hover:text-white hover:underline">Interest-Based Ads</a>
          </div>
          {/* Adjusted text color for better visibility against dark background */}
          <p className="text-xs text-gray-400">
            © 1996–{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
          </p>
        </div>

        {/* Logo at bottom right */}
        <div className="absolute bottom-4 right-4">
          <img
            src="/SM.png"
            alt="Sebastian Macwan Logo"
            className="h-10 w-auto object-contain opacity-15 hover:opacity-40"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
