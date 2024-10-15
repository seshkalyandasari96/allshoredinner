const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    userType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    noShowCount: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    token: { type: String },
    resetToken: { type: String }, 
    resetTokenExpiration: { type: Date } 
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
