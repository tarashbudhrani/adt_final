const mongoose = require('mongoose');

const usageRecordSchema = new mongoose.Schema({
    supply_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supply',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    reason: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UsageRecord', usageRecordSchema); 