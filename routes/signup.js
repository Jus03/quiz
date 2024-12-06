const express = require("express");
const User = require("../models/user");  // No need for bcrypt since we're not hashing passwords
const router = express.Router();

// Render signup page
router.get("/", (req, res) => {
  res.render("signup");
});

// Handle signup form submission (without password hashing)
router.post("/", async (req, res) => {
  const { name, username, password, email } = req.body;

  try {
    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }

    // Create the new user without hashing the password
    const newUser = new User({
      username,
      password,  // Store the plain text password (not hashed)
      email,
    });

    // Save the new user to the database
    await newUser.save();
    res.redirect("/login");  // Redirect to login page after successful signup
  } catch (error) {
    console.error("Error during signup:", error.message);  // Log the error message
    res.status(500).send("Server error");
  }
});

module.exports = router;
