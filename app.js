const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');  // Make sure the path is correct
const Score = require('./models/score');  // Make sure the path is correct

const userRouter = require('./models/user');
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const gameRouter = require('./routes/game');
const musicRouter = require('./routes/music');
const myProfileRouter = require('./routes/myProfile');
const quizRouter = require('./routes/quiz');
const quizpageRouter = require('./routes/quizpage');
const leaderboardRouter = require('./routes/leaderboard');
const loginRouter = require('./routes/auth'); // Handle login route
const signupRouter = require('./routes/signup'); // Handle signup route
const leaderboardsRouter = require('./routes/leaderboards');
const { ensureAuthenticated } = require('./routes/middleware/middle'); // Ensure user is authenticated

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(
  session({
    secret: 'random', // Change to a secure random key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect('mongodb+srv://mongodb:mongodb@quiz-app.3fy5w.mongodb.net/?retryWrites=true&w=majority&appName=quiz-app', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error', err));

// Routes
app.use('/', ensureAuthenticated, indexRouter);
app.use('/about', aboutRouter);
app.use('/game', gameRouter);
app.use('/Music', musicRouter);
app.use('/myProfile', myProfileRouter);
app.use('/quiz', ensureAuthenticated, quizRouter);
app.use('/quizpage', quizpageRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/leaderboards', ensureAuthenticated, leaderboardsRouter);
app.use('/login', loginRouter); // Login route
app.use('/signup', signupRouter); // Signup route
app.use('/user', userRouter, ensureAuthenticated);

app.get('/leaderboards', ensureAuthenticated, (req, res) => {
  const user = req.user;  // Ensure user is authenticated and available
  res.render('leaderboards', { user });
});

// Example of login route where session is set
app.post('/login', (req, res) => {
  // Assume user authentication is successful and user data is available
  const user = {
    username: 'user.username',  // Replace with actual username
    email: 'user.email',        // Replace with actual email
    score: 0,                   // Set the initial score or from the database
    duration: 200               // Set the duration or from the database
  };

  // Set user data in session
  req.session.user = user;

  // Redirect to the leaderboard page
  res.redirect('/leaderboards');
});


// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Error during logout');
    }
    res.redirect('/login'); // Redirect to login page after logging out
  });
});

// Passport local strategy for login
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      if (!user.validPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
      return done(null, user);
    });
  }
));

// Serialize user into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Route for quiz (requires user to be authenticated)
// app.js or routes/quiz.js
app.get('/quiz', ensureAuthenticated, (req, res) => {
  const user = req.user;  // Get the logged-in user from the session
  const username = user.username || 'Guest';
  const score = user.score || 0;  // Use the score from the database if available
  const duration = user.duration || 0; // Same for the duration
  
  res.render('quiz', {
      user: { username, score, duration }
  });
});

app.get('/leaderboards', (req, res) => {
  if (req.session.user) {
      res.render('leaderboards', {
          user: req.session.user // Ensure the user data is passed
      });
  } else {
      res.redirect('/login'); // Redirect if no user is logged in
  }
});




// Leaderboards POST route to save score
// Leaderboards POST route to save score
app.post('/leaderboards/submit', async (req, res) => {
  const username = req.user ? req.user.username : 'Guest'; // Use logged-in user or 'Guest'
  const { score, duration } = req.body; // Assuming these are part of the request body

  try {
    const newScore = new Score({ username, score, duration });
    await newScore.save(); // Save the score to the database
    res.json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Error submitting score' });
  }
});


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
