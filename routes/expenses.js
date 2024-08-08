const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', ensureAuthenticated, async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ lastUpdated: -1 });
  res.render('expenses/index', { expenses });
});

// Show form to create a new expense
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('expenses/new');
});

// Create a new expense
router.post('/', ensureAuthenticated, async (req, res) => {
  const { description, amount, category } = req.body;
  const newExpense = new Expense({
    description,
    amount,
    category,
    user: req.user.id
  });
  await newExpense.save();
  req.flash('success_msg', 'Expense added successfully');
  res.redirect('/expenses');
});

// Show form to edit an expense
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    req.flash('error_msg', 'Expense not found');
    return res.redirect('/expenses');
  }
  res.render('expenses/edit', { expense });
});

// Update an expense
router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { description, amount, category } = req.body;
  let expense = await Expense.findById(req.params.id);
  if (!expense) {
    req.flash('error_msg', 'Expense not found');
    return res.redirect('/expenses');
  }
  expense.description = description;
  expense.amount = amount;
  expense.category = category;
  expense.lastUpdated = Date.now();
  await expense.save();
  req.flash('success_msg', 'Expense updated successfully');
  res.redirect('/expenses');
});

// Delete an expense
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Expense deleted successfully');
  res.redirect('/expenses');
});

module.exports = router;
