const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    reorderLevel: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Supply', supplySchema); 