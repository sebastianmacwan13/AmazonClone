const express = require('express');
const router = express.Router();
const pool = require('../config/db.cjs'); // Make sure this path is correct relative to products.cjs
const {verifyAdmin,verifyToken} = require('../middlewares/auth.cjs'); // Adjust the path as necessary
// --- Route to get all products (GET /api/products is handled by app.use("/api/products", productsRouter) in server.cjs) ---
router.get('/', async (req, res) => {
    console.log('Attempting to fetch all products from the database...');
    try {
        const getAllProductsQuery = `
            SELECT
                id,
                title,
                image,
                description,
                price,
                category,
                created_at
            FROM
                products
            ORDER BY
                created_at DESC;
        `;
        const result = await pool.query(getAllProductsQuery);

        if (result.rows.length === 0) {
            console.log('No products found in the database.');
            return res.status(200).json({
                message: 'No products available at the moment.',
                products: []
            });
        }

        console.log(`Successfully fetched ${result.rows.length} products from the database.`);
        res.status(200).json({
            message: 'Products retrieved successfully!',
            products: result.rows
        });

    } catch (error) {
        console.error('ERROR in GET /api/products (fetching from DB):', error.message);
        console.error('SQL Error Code:', error.code);
        console.error('SQL Error Detail:', error.detail);
        console.error('Error Stack:', error.stack);

        res.status(500).json({
            message: 'Server error while fetching products. Please check backend logs for details.',
            error: error.message,
            sqlError: error.code
        });
    }
});

// --- Route to get a single product by ID (GET /api/products/:id) ---
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to fetch product with ID: ${id}`);
    try {
        const getProductByIdQuery = `
            SELECT id, title, image, description, price, category, created_at
            FROM products
            WHERE id = $1;
        `;
        const result = await pool.query(getProductByIdQuery, [id]);

        if (result.rows.length === 0) {
            console.log(`No product found with ID: ${id}`);
            return res.status(404).json({ message: 'Product not found.' });
        }

        console.log(`Successfully fetched product with ID: ${id}`);
        res.status(200).json({
            message: 'Product retrieved successfully!',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('ERROR in GET /api/products/:id (fetching from DB):', error.message);
        res.status(500).json({
            message: 'Server error while fetching product details.',
            error: error.message
        });
    }
});
// --- Route to add a new product (POST /api/products) ---
// router.post('/', async (req, res) => {
//     const { title, image, description, price, category } = req.body;

//     console.log('Attempting to add a new product:', req.body);

//     // Basic validation
//     if (!title || !price) {
//         return res.status(400).json({ message: 'Title and price are required.' });
//     }

//     try {
//         const insertProductQuery = `
//             INSERT INTO products (title, image, description, price, category)
//             VALUES ($1, $2, $3, $4, $5)
//             RETURNING *;
//         `;

//         const values = [title, image, description, price, category];

//         const result = await pool.query(insertProductQuery, values);

//         console.log('Product added successfully:', result.rows[0]);

//         res.status(201).json({
//             message: 'Product added successfully!',
//             product: result.rows[0]
//         });

//     } catch (error) {
//         console.error('ERROR in POST /api/products:', error.message);
//         res.status(500).json({
//             message: 'Server error while adding product.',
//             error: error.message
//         });
//     }
// });

// --- Route to add a new product (POST /api/products) ---
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const { title, image, description, price, category } = req.body;

    console.log('Attempting to add a new product:', req.body);

    if (!title || !price) {
        return res.status(400).json({ message: 'Title and price are required.' });
    }

    try {
        const insertProductQuery = `
            INSERT INTO products (title, image, description, price, category)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [title, image, description, price, category];
        const result = await pool.query(insertProductQuery, values);

        console.log('Product added successfully:', result.rows[0]);

        res.status(201).json({
            message: 'Product added successfully!',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('ERROR in POST /api/products:', error.message);
        res.status(500).json({
            message: 'Server error while adding product.',
            error: error.message
        });
    }
});

module.exports = router;
