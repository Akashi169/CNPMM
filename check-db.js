const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/product.model');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const products = await Product.find({}, '_id name');
    console.log('Total Products:', products.length);
    products.forEach(p => console.log(`ID: ${p._id}, Name: ${p.name}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
