const fs = require('fs');
const express = require('express');
const app = express();

// Importing products from products.json file
const productsFilePath = `${__dirname}/data/products.json`;
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Middlewares
app.use(express.json());

// Helper function to save the updated product list to the file
const saveProductsToFile = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
};

// PATCH endpoint to buy a product
app.patch('/api/v1/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  // Find the product by ID
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ status: 'failed', message: 'Product not found!' });
  }

  if (product.quantity === 0) {
    return res.status(404).json({ status: 'success', message: `Product ${product.name}, Out of stock!` });
  }

  // Reduce the product quantity by 1
  product.quantity -= 1;

  // Save the updated product list
  try {
    saveProductsToFile(products);
    res.status(200).json({
      status: 'success',
      message: `Thank you for purchasing ${product.name}`,
      product
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

const server = app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

module.exports = app;
