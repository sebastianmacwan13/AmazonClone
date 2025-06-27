const express = require('express');
const router = express.Router();
const pool = require('../config/db.cjs'); // Make sure this path is correct relative to cart.cjs

// --- Authentication Middleware for Cart Routes ---
// This middleware ensures a user_id is present in the request
const authenticateUser = (req, res, next) => {
    let userId = null;

    // For POST/PUT requests, check req.body.user_id
    if (req.method === 'POST' || req.method === 'PUT') {
        userId = req.body && req.body.user_id;
    }
    // For GET/DELETE requests, check req.query.user_id or req.params.user_id
    else if (req.method === 'GET' || req.method === 'DELETE') {
        userId = req.query && req.query.user_id; // Frontend sends user_id as query param for GET/DELETE cart
        // If you were to use a route parameter (e.g., /api/cart/:userId), you'd also check req.params.userId
        // if (!userId) { userId = req.params.userId; }
    }

    req.userId = userId; // Attach userId to the request object for later use

    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is required.' });
    }
    next(); // Proceed if user_id is found
};


// --- Route to add a product to the cart (POST /api/cart/add) ---
router.post('/add', authenticateUser, async (req, res) => {
    const { product_title, product_image, product_desc, product_price, quantity } = req.body;
    const user_id = req.userId; // Get the user ID from the authentication middleware

    if (!user_id || !product_title || !product_price || quantity === undefined || quantity === null) {
        return res.status(400).json({ message: 'Missing required fields: user_id, product_title, product_price, and quantity are mandatory.' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }
    if (isNaN(parseFloat(product_price)) || parseFloat(product_price) < 0) {
        return res.status(400).json({ message: 'Product price must be a non-negative number.' });
    }

    try {
        const checkCartQuery = `
            SELECT id, quantity FROM cart
            WHERE user_id = $1 AND product_title = $2;
        `;
        const checkResult = await pool.query(checkCartQuery, [user_id, product_title]);

        if (checkResult.rows.length > 0) {
            const existingItem = checkResult.rows[0];
            const newQuantity = existingItem.quantity + quantity;

            const updateCartQuery = `
                UPDATE cart
                SET quantity = $1, added_at = CURRENT_TIMESTAMP
                WHERE id = $2 AND user_id = $3
                RETURNING *;
            `;
            const updateResult = await pool.query(updateCartQuery, [newQuantity, existingItem.id, user_id]);

            if (updateResult.rows.length === 0) {
                return res.status(404).json({ message: 'Cart item not found for update (user mismatch).' });
            }

            return res.status(200).json({
                message: 'Product quantity updated in cart successfully!',
                cartItem: updateResult.rows[0]
            });
        } else {
            const insertCartQuery = `
                INSERT INTO cart (user_id, product_title, product_image, product_desc, product_price, quantity)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const result = await pool.query(insertCartQuery, [
                user_id,
                product_title,
                product_image || null,
                product_desc || null,
                parseFloat(product_price), // Ensure price is stored as a number
                quantity
            ]);

            return res.status(201).json({
                message: 'Product added to cart successfully!',
                cartItem: result.rows[0]
            });
        }
    } catch (error) {
        console.error('Error adding/updating product to cart:', error.message, error.stack);
        if (error.code === '23503') { // Foreign key violation (e.g., user_id not found)
             return res.status(400).json({ message: 'User does not exist. Please login with a valid user.', error: error.message });
        }
        res.status(500).json({ message: 'Server error while adding to cart.', error: error.message });
    }
});

// --- Route to get all cart items for a specific user (GET /api/cart) ---
router.get('/', authenticateUser, async (req, res) => {
    const user_id = req.userId; // Get the user ID from the authentication middleware

    try {
        const getCartQuery = `
            SELECT id, product_title, product_image, product_desc, product_price, quantity, added_at
            FROM cart
            WHERE user_id = $1
            ORDER BY added_at DESC;
        `;
        const result = await pool.query(getCartQuery, [user_id]);

        res.status(200).json({
            message: 'Cart items retrieved successfully!',
            cartItems: result.rows
        });
    } catch (error) {
        console.error('Error retrieving cart items:', error.message, error.stack);
        res.status(500).json({ message: 'Server error while retrieving cart.', error: error.message });
    }
});

// --- Route to remove a product from the cart (DELETE /api/cart/remove/:cartItemId) ---
router.delete('/remove/:cartItemId', authenticateUser, async (req, res) => {
    const { cartItemId } = req.params;
    const user_id = req.userId; // Get user_id from middleware

    try {
        const deleteCartItemQuery = `
            DELETE FROM cart
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;
        const result = await pool.query(deleteCartItemQuery, [cartItemId, user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found or does not belong to user.' });
        }

        res.status(200).json({ message: 'Cart item removed successfully!', removedItem: result.rows[0] });
    } catch (error) {
        console.error('Error removing cart item:', error.message, error.stack);
        res.status(500).json({ message: 'Server error while removing item from cart.', error: error.message });
    }
});

// --- Route to update quantity of a product in the cart (PUT /api/cart/update/:cartItemId) ---
router.put('/update/:cartItemId', authenticateUser, async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const user_id = req.userId; // Get user_id from middleware

    if (quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
    }

    try {
        let updateCartQuery;
        let queryParams;

        if (quantity === 0) {
            // If quantity is 0, delete the item
            updateCartQuery = `
                DELETE FROM cart
                WHERE id = $1 AND user_id = $2
                RETURNING *;
            `;
            queryParams = [cartItemId, user_id];
        } else {
            // Otherwise, update the quantity
            updateCartQuery = `
                UPDATE cart
                SET quantity = $1, added_at = CURRENT_TIMESTAMP
                WHERE id = $2 AND user_id = $3
                RETURNING *;
            `;
            queryParams = [quantity, cartItemId, user_id];
        }

        const result = await pool.query(updateCartQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found or does not belong to user.' });
        }

        res.status(200).json({
            message: quantity === 0 ? 'Cart item removed successfully!' : 'Cart item quantity updated successfully!',
            cartItem: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating cart item quantity:', error.message, error.stack);
        res.status(500).json({ message: 'Server error while updating cart item.', error: error.message });
    }
});

module.exports = router;
