const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
        type: String,
        enum: ['organizer', 'volunteer'],
        default: 'volunteer',
    },

    phone: { type: String },

    dob: { type: Date },

    address: { type: String },

    availability: { type: String },

    skills: { type: String }, 

    motivation: { type: String }, 
    hobbies: { type: [String] },
    interests: { type: [String] },
    otp: { type: String },
    otpExpiry: { type: Date },
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpiry: { type: Date },



}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
