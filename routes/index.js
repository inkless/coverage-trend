const express = require('express');
const Stats = require('../model/stats');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  Stats.getAllCategories()
    .then(categories => {
      res.render('index', {
        categories,
      });
    });
});

module.exports = router;
