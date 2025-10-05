// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Winter Jacket",
      price: 200,
      category: "Apparel",
      variants: [
        { color: "Black", size: "S", stock: 9 },
        { color: "Gray",  size: "M", stock: 12 }
      ]
    },
    {
      name: "Smartphone",
      price: 600,
      category: "Electronics",
      variants: []
    },
    {
      name: "Running Shoes",
      price: 120,
      category: "Footwear",
      variants: [
        { color: "Red",  size: "10", stock: 18 },
        { color: "Blue", size: "11", stock: 7 }
      ]
    }
  ]);

  console.log("Seeded sample products");
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
