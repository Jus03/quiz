const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  duration: { type: Number, required: true }, // Assuming this is in minutes or seconds
});

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
