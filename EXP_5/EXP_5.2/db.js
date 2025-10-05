const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/studentDB');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
