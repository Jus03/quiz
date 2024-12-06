const express = require("express");
const User = require("../models/user");
const router = express.Router();

// Render login page
router.get("/", (req, res) => {
  res.render("login");
});

// Handle login form submission
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || password !== user.password) {
      return res.status(400).send("Invalid email or password!");
    }

    // Store user data in session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/quiz");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error");
  }
});

// Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Server error");
    }
    res.redirect("/login");
  });
});

module.exports = router;
