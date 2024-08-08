const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const { ensureAuthenticated } = require('../middleware/auth');

// GET statistics page
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    // Calculate statistics
    const categories = {};
    expenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    res.render('statistics', { categories: JSON.stringify(categories) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
