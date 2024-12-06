var express = require('express');
var router = express.Router();
var axios = require('axios');
const User = require('../models/user'); // Ensure correct path to the model
const Score = require('../models/score');
// Fetching quiz questions
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple');
        const questions = response.data.results;
        const score = 0;
        const user = req.user || null; // Ensure user object is passed to template (or null if no user)
        
        res.render('quiz_files/quiz', { questions, score, user }); // Pass user, questions, and score to quiz.ejs
    } catch (error) {
        res.status(500).send('Error retrieving data from OpenTDB');
    }
});

// Endpoint to get dynamic number of questions
router.get('/get-questions', async (req, res) => {
    const amount = req.query.amount;
    const validAmounts = [10, 20, 30, 40, 50];

    if (!validAmounts.includes(parseInt(amount))) {
        return res.status(400).json({ message: 'Invalid number of questions requested.' });
    }

    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=12&difficulty=medium&type=multiple`);
        const questions = response.data.results; // Get questions from response
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data from OpenTDB' });
    }
});

// Submit score to leaderboard
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10); // Sort scores in descending order
        res.render('leaderboards', { scores });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).send('Error fetching leaderboard');
    }
});
// Endpoint to get leaderboard
// In your quiz.js or leaderboard.js file
router.post('/leaderboards/submit', async (req, res) => {
    const { username, email, score, duration } = req.body;

    try {
        const newScore = new Score({
            username,
            email,
            score,
            duration
        });

        await newScore.save(); // Save the score to the database
        res.status(200).json({ message: 'Score submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving score.' });
    }
});


module.exports = router;
