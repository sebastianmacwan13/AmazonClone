const express = require('express');
const router = express.Router();
const pool = require('../config/db.cjs'); // Make sure this path is correct relative to products.cjs
const {verifyAdmin,verifyToken} = require('../middlewares/auth.cjs'); // Adjust the path as necessary
const multer = require('multer');
const path = require("path");

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

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// --- Route to add a new product (POST /api/products) ---
// ✅ Now supports both URL & file upload
router.post('/', verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    let imageUrl = req.body.image; // default: URL-based

    // If file is uploaded, override with local path
    // if (req.file) {
    //   imageUrl = `/uploads/${req.file.filename}`;
    // }
    if (req.file) {
  imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
}


    if (!title || !price) {
      return res.status(400).json({ message: 'Title and price are required.' });
    }

    const insertProductQuery = `
      INSERT INTO products (title, image, description, price, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, imageUrl, description, price, category];
    const result = await pool.query(insertProductQuery, values);

    res.status(201).json({
      message: '✅ Product added successfully!',
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
// --- Update product ---
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
//   const { id } = req.params;
const id = parseInt(req.params.id, 10);

  const { title, image, description, price, category } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET title = $1, image = $2, description = $3, price = $4, category = $5
       WHERE id = $6
       RETURNING *;`,
      [title, image, description, price, category, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated successfully!', product: result.rows[0] });
  } catch (error) {
    console.error('ERROR updating product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// // --- Delete product ---
router.delete('/:id', verifyToken, async (req, res) => {
  console.log("DELETE /api/products/:id called");
  console.log("req.params.id:", req.params.id);
  console.log("req.user:", req.user);

  const id = parseInt(req.params.id, 10);
  console.log("Backend received DELETE request for product ID:", id);
  console.log("Parsed ID:", id);

  try {
    const result = await pool.query(
      `DELETE FROM products WHERE id = $1 RETURNING *;`,
      [id]
    );

    console.log("Delete query result:", result.rows);

    if (result.rows.length === 0) {
      console.log("Product not found in DB for deletion.");
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully!', product: result.rows[0] });
  } catch (error) {
    console.error('ERROR deleting product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
