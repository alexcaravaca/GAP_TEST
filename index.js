const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3010;

// Load the product data
const products = require('./data.json');

//  Get list of product order by title
app.get("/products/sorted", (req, res) => {
  const sortedProducts = [...products].sort((a, b) => a.title.localeCompare(b.title));
  res.json(sortedProducts);
});

//  Get list of products categories
app.get("/products/categories", (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

//  Get top 10 products base on the price
app.get("/products/top10", (req, res) => {
    const top10 = [...products].sort((a, b) => b.price - a.price).slice(0, 10);
    res.json(top10);
});

// Get top product category with the rate and count highest
app.get("/products/top-category", (req, res) => {
    const categoryStats = {};

    products.forEach(({ category, rating }) => {
        if (!categoryStats[category]) {
            categoryStats[category] = { totalRate: 0, totalCount: 0, productCount: 0 };
        }
        categoryStats[category].totalRate += rating.rate;
        categoryStats[category].totalCount += rating.count;
        categoryStats[category].productCount += 1;
    });

    const topCategory = Object.entries(categoryStats)
        .map(([category, data]) => ({
            category,
            avgRate: data.totalRate / data.productCount,
            totalCount: data.totalCount,
        }))
        .sort((a, b) => b.avgRate - a.avgRate || b.totalCount - a.totalCount)[0];

    res.json(topCategory);
});

// Get the cheapest and expensive product 
app.get("/products/extremes", (req, res) => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    res.json({ cheapest: sorted[0], mostExpensive: sorted[sorted.length - 1] });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));