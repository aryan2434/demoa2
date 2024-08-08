const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// GET home page
router.get('/', (req, res) => {
  res.render('home');
});

module.exports = router;
