const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/category');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const categories = [
  { name: 'Food' },
  { name: 'Transport' },
  { name: 'Entertainment' },
  { name: 'Health' },
  { name: 'Utilities' },
  { name: 'Others' },
  { name: 'Personal' }

];

Category.insertMany(categories)
  .then(() => {
    console.log('Categories seeded successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding categories:', err);
    mongoose.connection.close();
  });
