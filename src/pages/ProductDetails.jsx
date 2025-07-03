import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

const ProductDetail = ({ API_BASE_URL, currentUser, showGlobalMessage, updateNavCartCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      let selectedProduct = JSON.parse(sessionStorage.getItem("selectedProduct"));

      if (!selectedProduct || String(selectedProduct.id) !== String(id)) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
          const data = await response.json();

          if (response.ok && data.product) {
            setProduct(data.product);
            sessionStorage.setItem("selectedProduct", JSON.stringify(data.product));
          } else {
            setError(data.message || 'Failed to load product details.');
            showGlobalMessage(data.message || 'Product not found.', 'error');
            navigate('/');
          }
        } catch (err) {
          console.error("Network error:", err);
          setError('Network error: Could not connect.');
          showGlobalMessage('Network error: Could not load product.', 'error');
          navigate('/');
        } finally {
          setLoading(false);
        }
      } else {
        setProduct(selectedProduct);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, API_BASE_URL, navigate, showGlobalMessage]);

  const handleAddToCart = async () => {
    if (!currentUser?.id) {
      showGlobalMessage("Please login to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!product) {
      showGlobalMessage("Error: No product data available.", "error");
      return;
    }

    const price = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
    if (isNaN(price)) {
      showGlobalMessage("Invalid product price.", "error");
      return;
    }

    const cartItem = {
      user_id: currentUser.id,
      product_title: product.title,
      product_image: product.image || null,
      product_desc: product.description || null,
      product_price: price,
      quantity: 1,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
      const data = await res.json();

      if (res.ok) {
        showGlobalMessage(data.message || "Product added to cart!");
        updateNavCartCount();
      } else {
        showGlobalMessage(data.message || "Add to cart failed.", "error");
      }
    } catch (err) {
      showGlobalMessage("Server error. Try again later.", "error");
      console.error("Cart error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-10 text-center text-blue-600 text-xl dark:text-blue-300">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 text-center text-red-600 text-xl dark:text-red-400">
        {error}
        <p className="mt-4">
          <NavLink to="/" className="text-blue-600 hover:underline">Go back to Home</NavLink>
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto my-10 text-center text-red-600 text-xl dark:text-red-400">
        No product found.
        <p className="mt-4">
          <NavLink to="/" className="text-blue-600 hover:underline">Go back to Home</NavLink>
        </p>
      </div>
    );
  }

  return (
    // <div className="max-w-6xl mx-auto px-4 py-10">
    //   <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    //     {/* Product Image */}
    //     <div className="md:w-1/2 flex justify-center items-center p-6">
    //       <img
    //         src={product.image || 'https://placehold.co/400x400?text=No+Image'}
    //         alt={product.title}
    //         className="max-w-full max-h-[400px] rounded-lg object-contain"
    //       />
    //     </div>

    //     {/* Product Details */}
    //     <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-5">
    //       <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
    //       <p className="text-2xl text-red-600 dark:text-red-400 font-semibold">
    //         ₹{parseFloat(product.price).toFixed(2)}
    //       </p>
    //       <p className="text-gray-700 dark:text-gray-300">{product.description || "No description provided."}</p>

    //       <div className="flex flex-col sm:flex-row gap-4 mt-6">
    //         <button
    //           onClick={handleAddToCart}
    //           className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         >
    //           Add to Cart
    //         </button>

    //         <NavLink
    //           to="/cart"
    //           className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    //         >
    //           View Cart
    //         </NavLink>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="max-w-6xl mx-auto px-4 py-10">
  <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">

    {/* Product Image */}
    <div className="w-full lg:w-1/2 flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
      <img
        src={product.image || 'https://placehold.co/400x400?text=No+Image'}
        alt={product.title}
        className="w-full max-w-sm h-auto sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] object-contain rounded-lg shadow"
      />
    </div>

    {/* Product Details */}
    <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center space-y-5 text-center sm:text-left">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
        {product.title}
      </h1>

      <p className="text-xl sm:text-2xl text-red-600 dark:text-red-400 font-semibold">
        ₹{parseFloat(product.price).toFixed(2)}
      </p>

      <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
        {product.description || "No description provided."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center sm:justify-start">
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Add to Cart
        </button>

        <NavLink
          to="/cart"
          className="border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-md text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          View Cart
        </NavLink>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductDetail;
