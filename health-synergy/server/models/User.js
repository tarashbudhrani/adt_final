const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'nurse', 'pharmacist']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 