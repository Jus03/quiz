  const express = require('express');
  const router = express.Router();
  const User = require('../models/user');
  const Score = require('../models/score');
  // Route to submit score

  // Route to fetch leaderboard
// Route to fetch leaderboard
// Route to fetch leaderboard
router.post('/leaderboards/submit', async (req, res) => {
  const { username, email, score, duration } = req.body;

  try {
      // Save the score to the leaderboard
      const newScore = new Score({
          username,
          email,
          score,
          duration
      });

      await newScore.save();  // Save the score to the database

      // Update the user's score and duration
      const user = await User.findOne({ username });
      if (user) {
          user.score = score;
          user.duration = duration;
          await user.save();
      }

      res.json({ message: 'Score submitted successfully' });
  } catch (error) {
      console.error('Error submitting score:', error);
      res.status(500).json({ message: 'Error submitting score' });
  }
});


router.get('/', async (req, res) => {
  try {
    // Query the leaderboard data from the database and sort by score
    const leaderboard = await Score.find().sort({ score: -1 }).limit(20); // Sort by score in descending order

    console.log(leaderboard); // Debugging: Check the data

    // Render the leaderboard page, passing the leaderboard data to the view
    res.render('leaderboards', { leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

  module.exports = router;
