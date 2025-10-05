// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err));

app.get('/products', async (req, res) => {
  const all = await Product.find({});
  res.json(all);
});

app.get('/products/category/:cat', async (req, res) => {
  const cat = req.params.cat;
  const docs = await Product.find({ category: cat });
  res.json(docs);
});

app.get('/products/by-color/:color', async (req, res) => {
  const color = req.params.color;
  // Return full product doc where any variant color matches
  const docs = await Product.find({ "variants.color": color }, { name: 1, variants: { $elemMatch: { color } } });
  res.json(docs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
