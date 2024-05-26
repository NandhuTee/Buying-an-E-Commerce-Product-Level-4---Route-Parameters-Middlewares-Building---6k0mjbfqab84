const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);


// Middlewares
app.use(express.json());

// Write PATCH endpoint to buy a product for the client here
// Endpoint /api/v1/products/:id

app.patch('/api/v1/products/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const product = products.find((entry) => id === entry.id);
    if(!product){
        return res.status(404).json({
            status: 'failed',
            message: "Product not found!"
        })
    }
    if(product.quantity < 1){
        return res.status(404).json({
            "status": "success", "message": `${product.name} , Out of stock!`
        })
    }
    product.quantity -= 1;
    return res.status(200).json({
        "status": "success",
        "message": `Thank you for purchasing ${product.name}`,
        product
    })
})




module.exports = app;
