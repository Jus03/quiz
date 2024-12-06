const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']  // email validation
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type:Number,
        default:0
    },
    score: {
        type: Number,
        default: 0,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

// Remove the password hashing logic, as we no longer want to hash it
userSchema.pre('save', async function(next) {
    // No password hashing is done here
    next();
});

// Compare entered password with the plain password in the database
userSchema.methods.comparePassword = async function(password) {
    return password === this.password;  // Directly compare the plain passwords
};

const User = mongoose.model('User', userSchema);

module.exports = User;
