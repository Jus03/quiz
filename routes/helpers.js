// helpers.js
const axios = require('axios');

async function fetchQuestions() {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple');
        return response.data.results; // Return the questions array
    } catch (error) {
        throw new Error('Error retrieving data from OpenTDB');
    }
}

module.exports = { fetchQuestions };
