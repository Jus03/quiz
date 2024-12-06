var express = require('express');
const axios = require('axios');
var router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch data from OpenTDB
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple');
    const questions = response.data.results;
    res.render('questions', { questions });
  } catch (error) {
    res.status(500).send('Error retrieving data from OpenTDB');
  }
});


router.post('/', async (req, res) => {
    const category = req.body.category;
    const amount = req.body.amount;
  
    try {
      // Fetch data from OpenTDB
      const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple');
      const questions = response.data.results;
      res.render('questions', { questions });
    } catch (error) {
      res.status(500).send('Error retrieving data from OpenTDB');
    }
  });

module.exports = router;