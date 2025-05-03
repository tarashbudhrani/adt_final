const express = require('express');
const router = express.Router();
const Supply = require('../models/Supply');

// Get all supplies
router.get('/', async (req, res) => {
    try {
        const supplies = await Supply.find();
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get supplies below reorder level
router.get('/reorder-alert', async (req, res) => {
    try {
        const supplies = await Supply.find({
            $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
        });
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new supply
router.post('/', async (req, res) => {
    const supply = new Supply({
        name: req.body.name,
        category: req.body.category,
        stockQuantity: req.body.stockQuantity,
        reorderLevel: req.body.reorderLevel
    });

    try {
        const newSupply = await supply.save();
        res.status(201).json(newSupply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update supply
router.put('/:id', async (req, res) => {
    try {
        const supply = await Supply.findById(req.params.id);
        if (supply) {
            Object.assign(supply, req.body);
            const updatedSupply = await supply.save();
            res.json(updatedSupply);
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete supply
router.delete('/:id', async (req, res) => {
    try {
        const result = await Supply.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Supply removed' });
        } else {
            res.status(404).json({ message: 'Supply not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 