var express = require('express');
var router = express.Router();
var axios = require('axios'); 
// If using Bottleneck or a similar library for rate limiting, define it here
// const Bottleneck = require('bottleneck');
// const limiter = new Bottleneck({ minTime: 333 });

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple');
        const questions = response.data.results;
        res.render('quiz_files/quizpage', { questions }); // Pass questions to quizpage.ejs
    } catch (error) {
        console.error('Error retrieving data from OpenTDB:', error);
        res.status(500).send('Error retrieving data from OpenTDB');
    }
});

router.get('/get-questions', async (req, res) => {
    const amount = req.query.amount || 10; // Default to 10 if not provided
    const validAmounts = [10, 20, 30, 40, 50];

    if (!validAmounts.includes(parseInt(amount))) {
        return res.status(400).json({ message: 'Invalid number of questions requested.' });
    }

    try {
        const response = await limiter.schedule(() =>
            axios.get(`https://opentdb.com/api.php?amount=${amount}&category=12&difficulty=medium&type=multiple`)
        );
        const questions = response.data.results;
        res.json({ results: questions }); // Send results as a JSON object
    } catch (error) {
        console.error('Error retrieving data from OpenTDB:', error);
        res.status(500).json({ message: 'Error retrieving data from OpenTDB' });
    }
});

router.get('/quiz', (req, res) => {
    const user = req.user || null;  // assuming `req.user` holds the user data
    const score = 0; // Initialize score
    res.render('quiz_files/quiz', { user, score });
});
module.exports = router;
