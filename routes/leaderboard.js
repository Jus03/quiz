const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Render the leaderboard page (list all users)
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.render('leaderboard', { users }); // Render the leaderboard page
    } catch (err) {
        res.status(500).send('Server error: Unable to fetch users.');
    }
});

// Render the form to create a new user
router.get('/new', (req, res) => {
    res.render('new'); // Render the user creation form
});

// CREATE a new user
// CREATE a new user
router.post('/new', async (req, res) => {
    try {
        const { username, email, password,score,age } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).send('Username, email, and password are required.');
        }

        const user = new User({ username, email, password,score,age});
        await user.save();
        res.redirect('/leaderboard'); // Redirect to the leaderboard
    } catch (err) {
        // Handle duplicate key error for email or username
        if (err.code === 11000) {
            return res.status(400).send('Username or email already exists.');
        }

        if (err.name === 'ValidationError') {
            return res.status(400).send(`Validation error: ${err.message}`);
        } else {
            return res.status(500).send('Server error: Unable to create user.');
        }
    }
});


// Render the form to edit an existing user
router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.render('edit', { user });
    } catch (err) {
        res.status(400).send('Invalid user ID format.');
    }
});

// READ a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.render('view', { user });
    } catch (err) {
        res.status(400).send('Invalid user ID format.');
    }
});

// UPDATE a user by ID
router.post('/:id/update', async (req, res) => {
    try {
        const { username, email, password,score,age } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).send('All fields are required.');
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, password,score,age },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.redirect('/leaderboard'); // Redirect to the homepage after updating
    } catch (err) {
        res.status(400).send('Validation error.');
    }
});

// DELETE a user by ID
router.post('/:id/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.redirect('/leaderboard'); // Redirect to the homepage after deletion
    } catch (err) {
        res.status(400).send('Invalid user ID format.');
    }
});

module.exports = router;
