import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Cart = ({ API_BASE_URL, currentUser, showGlobalMessage, updateNavCartCount }) => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // 🛡️ prevent multiple navigations
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setCartItems([]);
    setSubtotal(0);

    if (!currentUser?.id) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        showGlobalMessage("Please log in to view your cart.", "error");
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart?user_id=${currentUser.id}`);
      const data = await res.json();
      if (res.ok && data.cartItems) {
        setCartItems(data.cartItems);
        const total = data.cartItems.reduce((acc, item) =>
          acc + parseFloat(item.product_price) * item.quantity, 0
        );
        setSubtotal(total);
        updateNavCartCount();
      } else {
        showGlobalMessage(data.message || "Failed to load cart.", "error");
      }
    } catch (err) {
      console.error(err);
      showGlobalMessage("Failed to connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, currentUser, showGlobalMessage, updateNavCartCount, navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleQuantityChange = async (cartItemId, newQuantityStr) => {
    const newQuantity = parseInt(newQuantityStr, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return showGlobalMessage("Invalid quantity.", "error");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity, user_id: currentUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        showGlobalMessage(data.message || "Quantity updated.");
        fetchCartItems();
      } else {
        showGlobalMessage(data.message || "Failed to update.", "error");
      }
    } catch (err) {
      console.error(err);
      showGlobalMessage("Network error.", "error");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/remove/${cartItemId}?user_id=${currentUser.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        showGlobalMessage(data.message || "Item removed.");
        fetchCartItems();
      } else {
        showGlobalMessage(data.message || "Remove failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showGlobalMessage("Network error.", "error");
    }
  };

  const handleCheckout = () => {
    showGlobalMessage("Checkout not implemented yet!", "info");
  };

  if (loading) {
    return (
      <div className="text-center text-blue-500 text-lg p-10 dark:text-blue-300">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6"> {/* Adjusted padding */}
      <h2 className="text-3xl font-bold mb-6 dark:text-white">Shopping Cart</h2>

      {!currentUser && (
        <div className="p-4 mb-6 text-yellow-800 bg-yellow-100 rounded-md dark:bg-yellow-900 dark:text-yellow-200">
          Please <NavLink to="/login" className="underline text-blue-600 dark:text-blue-300">log in</NavLink> to view your cart.
        </div>
      )}

      {currentUser && cartItems.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg dark:bg-gray-800"> {/* Adjusted padding */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left table-auto"> {/* Added table-auto */}
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Product</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Price</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Quantity</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Total</th>
                  <th className="px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-100">
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t dark:border-gray-700">
                    <td className="px-2 py-3 sm:px-4 sm:py-3 flex items-center space-x-2 sm:space-x-3 text-sm">
                      <img
                        src={item.product_image || 'https://placehold.co/50x50?text=No+Image'}
                        alt={item.product_title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0"
                      />
                      <span className="flex-grow min-w-0 truncate">{item.product_title}</span>
                    </td>
                    <td className="px-2 py-3 sm:px-4 sm:py-3 text-sm">${parseFloat(item.product_price).toFixed(2)}</td>
                    <td className="px-2 py-3 sm:px-4 sm:py-3 text-sm">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="w-14 sm:w-16 px-1 py-0.5 sm:px-2 sm:py-1 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-sm"
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-3 sm:px-4 sm:py-3 font-semibold text-sm">
                      {(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-2 py-3 sm:px-4 sm:py-3 text-sm">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs sm:text-sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal + Checkout */}
          <div className="text-right mt-6">
            <h4 className="text-xl sm:text-2xl font-semibold">Subtotal: ${subtotal.toFixed(2)}</h4>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 text-base sm:text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {currentUser && cartItems.length === 0 && !loading && (
        <div className="text-center text-blue-700 bg-blue-100 p-4 rounded-md mt-4 dark:text-blue-200 dark:bg-blue-800">
          Your cart is empty. Start shopping!
        </div>
      )}

      <div className="mt-6">
        <NavLink
          to="/"
          className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Continue Shopping
        </NavLink>
      </div>
    </div>
  );
};

export default Cart;