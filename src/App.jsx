import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Cart from './pages/Cart';
// import './index.css';
import ProductDetail from './pages/ProductDetails';
import mode from './functions.js';
import Logins from './components/Logins.jsx';
import ForgotPassword from './pages/Forgot-password.jsx';
import Reset_password from './pages/Reset_password.jsx';
import Contactform from './pages/Contact';

// const API_BASE_URL = "https://amazon-clone-fullstack.onrender.com";
// const API_BASE_URL = "https://amazon-clone-reactversion.onrender.com"; // ✅ MUST match your Express backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const App = () => {
   
    // Initialize currentUser from localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("currentUser");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse currentUser from localStorage", error);
            return null;
        }
    });

    const [message, setMessage] = useState({ text: "", type: "" });
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
  mode(); // ✅ Apply theme on first render
}, []);
    // Effect to set up message display and auto-hide
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 3000); // Message disappears after 3 seconds
            return () => clearTimeout(timer);
        }
        
    }, [message]);

    // Function to show a global message
    const showGlobalMessage = (text, type = "success") => {
        setMessage({ text, type });
    };

    // Function to update cart count in the navbar
    const updateNavCartCount = async () => {
        if (currentUser?.id) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/cart?user_id=${currentUser.id}`);
                const contentType = res.headers.get("content-type");

                // Protect against receiving HTML
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Expected JSON, got non-JSON (likely HTML fallback). Check route or proxy.");
                }

                const data = await res.json();
                if (res.ok) {
                    setCartCount(data.cartItems?.length || 0);
                } else {
                    console.error("Failed to fetch cart count:", data.message || res.statusText);
                }
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        } else {
            setCartCount(0); // If no user, cart is empty
        }
    };

    // Fetch cart count on initial load and when currentUser changes
    useEffect(() => {
        updateNavCartCount();
    }, [currentUser, API_BASE_URL, updateNavCartCount]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        setCartCount(0); // Reset cart count on logout
        showGlobalMessage("Logged out successfully!", "success");
    };

    return (
        <div> {/* No <Router> here; it should be in index.js */}
            <Navbar
                currentUser={currentUser}
                cartCount={cartCount}
                handleLogout={handleLogout}
                // handleThemeToggle={handleThemeToggle}
               
            />
            {message.text && (
                <div id="globalMessageBox" className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50
                                    ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    role="alert">
                    {message.text}
                </div>
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            API_BASE_URL={API_BASE_URL}
                            currentUser={currentUser}
                            showGlobalMessage={showGlobalMessage}
                            updateNavCartCount={updateNavCartCount}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Logins
                            API_BASE_URL={API_BASE_URL}
                            setCurrentUser={setCurrentUser}
                            showGlobalMessage={showGlobalMessage}
                            updateNavCartCount={updateNavCartCount}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <Signup
                            API_BASE_URL={API_BASE_URL}
                            showGlobalMessage={showGlobalMessage}
                            setCurrentUser={setCurrentUser}
                            updateNavCartCount={updateNavCartCount}
                        />
                    }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contactform />} />

                {/* Product Detail Route */}
                <Route
                    path="/product/:id"
                    element={
                        <ProductDetail
                            API_BASE_URL={API_BASE_URL}
                            currentUser={currentUser}
                            showGlobalMessage={showGlobalMessage}
                            updateNavCartCount={updateNavCartCount}
                        />
                    }
                />

                {/* Cart Route */}
                <Route
                    path="/cart"
                    element={
                        <Cart
                            API_BASE_URL={API_BASE_URL}
                            currentUser={currentUser}
                            showGlobalMessage={showGlobalMessage}
                            updateNavCartCount={updateNavCartCount}
                        />
                    }
                />

                {/* Profile Route */}
                {currentUser && (
                    <Route
                        path="/profile"
                        element={
                            <Profile
                                API_BASE_URL={API_BASE_URL}
                                currentUser={currentUser}
                                showGlobalMessage={showGlobalMessage}
                                setCurrentUser={setCurrentUser}
                            />
                        }
                    />
                )}
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword 
                        API_BASE_URL={API_BASE_URL}
                                currentUser={currentUser}
                                showGlobalMessage={showGlobalMessage}
                                setCurrentUser={setCurrentUser}
                             />
                    }
                />
                
                {/* Redirect for unknown routes */}
                <Route path="*" element={<Home API_BASE_URL={API_BASE_URL} currentUser={currentUser} showGlobalMessage={showGlobalMessage} updateNavCartCount={updateNavCartCount} />} />
           <Route
                    path="/reset_password"
                    element={<Reset_password 
                    API_BASE_URL={API_BASE_URL}
                                currentUser={currentUser}
                                showGlobalMessage={showGlobalMessage}
                                setCurrentUser={setCurrentUser}
                            />
                    }
                />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
