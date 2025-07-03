import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ API_BASE_URL, currentUser, showGlobalMessage, updateNavCartCount }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noProducts, setNoProducts] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchBoxRef = useRef(null);
    const suggestionListRef = useRef(null);

    // --- Fetch Products from Backend ---
    const fetchProducts = async () => {
        setLoading(true);
        setNoProducts(false);
        try {
            // Using a relative path for API_BASE_URL, ensure it's correctly configured
            // If your API_BASE_URL includes a domain, use it: await fetch(`${API_BASE_URL}/api/products`);
            const response = await fetch(`${API_BASE_URL}/api/products`);
            const data = await response.json();

            if (response.ok && data.products) {
                setProducts(data.products);
                if (data.products.length === 0) {
                    setNoProducts(true);
                }
            } else {
                console.error('Failed to fetch products:', data.message || response.statusText);
                showGlobalMessage(data.message || 'Failed to load products. Please try again.', 'error');
                setNoProducts(true);
            }
        } catch (error) {
            console.error('Network error during product fetch:', error);
            showGlobalMessage('Network error: Could not connect to the server to load products.', 'error');
            setNoProducts(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- Add to Cart Handler ---
    const handleAddToCart = async (productId) => {
        if (!currentUser || !currentUser.id) {
            showGlobalMessage("Please login to add items to cart.", "error");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }

        const productToAdd = products.find(p => String(p.id) === String(productId));

        if (!productToAdd) {
            showGlobalMessage("Error: Product details not found.", "error");
            console.error("Product with ID not found:", productId);
            return;
        }

        const productPriceNumeric = parseFloat(String(productToAdd.price).replace(/[^0-9.-]+/g, ""));
        if (isNaN(productPriceNumeric)) {
            showGlobalMessage("Invalid product price. Cannot add to cart.", "error");
            console.error("Product price is not a valid number:", productToAdd.price);
            return;
        }

        const cartItemPayload = {
            user_id: currentUser.id,
            product_title: productToAdd.title,
            product_image: productToAdd.image || null,
            product_desc: productToAdd.description || null,
            product_price: productPriceNumeric,
            quantity: 1
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItemPayload)
            });

            const data = await response.json();

            if (response.ok) {
                showGlobalMessage(data.message || "Product added to cart successfully!");
                updateNavCartCount(); // Update the cart count in navbar
            } else {
                console.error('Failed to add to cart:', data.message || response.statusText);
                showGlobalMessage(data.message || "Failed to add product to cart. Please try again.", "error");
            }
        } catch (error) {
            console.error('Network error during add to cart:', error);
            showGlobalMessage("Network error: Could not connect to the server.", "error");
        }
    };

    // --- View Details Handler ---
    const handleViewDetails = (productId) => {
        const selectedProduct = products.find(p => String(p.id) === String(productId));
        if (selectedProduct) {
            sessionStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
            navigate(`/product/${productId}`); // Use React Router for navigation
        } else {
            showGlobalMessage("Product details not found.", "error");
        }
    };

    // --- Search Autocomplete Logic ---
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length === 0) {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = products.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (s) => {
        setSearchQuery(s.title);
        setSuggestions([]);
        handleViewDetails(s.id); // Navigate to product detail page
    };

    // Hide suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target) &&
                suggestionListRef.current && !suggestionListRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="max-w-xl mx-auto mt-4 mb-3 px-4 relative">
                <input
                    type="text"
                    id="searchBox"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
               text-black bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-colors duration-300"
                    placeholder="Search products..."
                    autoComplete="off"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    ref={searchBoxRef}
                />

                {suggestions.length > 0 && searchQuery.length > 0 && (
                    <ul
                        id="suggestionList"
                        className="absolute w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                 rounded shadow-lg mt-1 z-30 transition-colors duration-300 opacity-95"
                        ref={suggestionListRef}
                    >
                        {suggestions.map((s) => (
                            <li
                                key={s.id}
                                className="px-4 py-2 cursor-pointer border-b border-gray-200 dark:border-gray-600 
                     hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white last:border-b-0"
                                onClick={() => handleSuggestionClick(s)}
                            >
                                {s.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            {/* Featured Products */}
            <div className="container mx-auto mt-4 px-4">
                <h2 className="text-center font-bold text-2xl mb-4">Featured Products</h2>

                {loading && (
                    <div className="bg-blue-100 text-blue-700 p-3 text-center rounded">
                        Loading products...
                    </div>
                )}

                {!loading && noProducts && (
                    <div className="bg-yellow-100 text-yellow-700 p-3 text-center rounded">
                        No products available at the moment.
                    </div>
                )}

                {!loading && !noProducts && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-3">
                        {products.map((product) => (
                            <div key={product.id} className="w-full">
                                <div className="bg-white rounded-lg shadow h-full flex flex-col overflow-hidden border border-gray-200  transform transition-transform duration-300 ease-out
               hover:scale-105 hover:translate-y-[-5px]">
                                    <img
                                        src={product.image || "https://placehold.co/400x200?text=No+Image"}
                                        className="w-full h-48 object-cover object-center"
                                        alt={product.title}
                                    />
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h6 className="text-md font-semibold text-gray-800 mb-1 leading-tight">
                                            {product.title}
                                        </h6>
                                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                                            {product.description || "No description."}
                                        </p>
                                        <p className="font-bold text-red-600 text-xl mb-3">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </p>
                                        <div className="mt-auto flex flex-col sm:flex-row gap-2">
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm transition duration-150 ease-in-out w-full sm:w-auto"
                                                onClick={() => handleAddToCart(product.id)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="border border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold py-2 px-3 rounded text-sm transition duration-150 ease-in-out w-full sm:w-auto"
                                                onClick={() => handleViewDetails(product.id)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;