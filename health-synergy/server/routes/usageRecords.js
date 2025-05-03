const express = require('express');
const router = express.Router();
const UsageRecord = require('../models/UsageRecord');
const Supply = require('../models/Supply');

// Get all usage records
router.get('/', async (req, res) => {
    try {
        const records = await UsageRecord.find()
            .populate('supply_id')
            .populate('user_id');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get usage records in last 7 days
router.get('/recent', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const records = await UsageRecord.find({
            date: { $gte: sevenDaysAgo }
        })
            .populate('supply_id')
            .populate('user_id');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get total items used per user
router.get('/user-totals', async (req, res) => {
    try {
        const totals = await UsageRecord.aggregate([
            {
                $group: {
                    _id: '$user_id',
                    totalItems: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);
        res.json(totals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new usage record
router.post('/', async (req, res) => {
    const session = await UsageRecord.startSession();
    session.startTransaction();

    try {
        // Check if supply exists and has enough quantity
        const supply = await Supply.findById(req.body.supply_id);
        if (!supply) {
            throw new Error('Supply not found');
        }
        if (supply.stockQuantity < req.body.quantity) {
            throw new Error('Insufficient stock');
        }

        // Create usage record
        const record = new UsageRecord({
            supply_id: req.body.supply_id,
            user_id: req.body.user_id,
            quantity: req.body.quantity,
            reason: req.body.reason,
            date: req.body.date || new Date()
        });

        // Update supply quantity
        supply.stockQuantity -= req.body.quantity;
        await supply.save({ session });
        const newRecord = await record.save({ session });

        await session.commitTransaction();
        res.status(201).json(newRecord);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router; 