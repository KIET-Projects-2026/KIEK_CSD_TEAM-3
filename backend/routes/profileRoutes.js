const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/profile/recruiter/:id
// @desc    Get recruiter profile
// @access  Public (or Protected if middleware added)
router.get('/recruiter/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'recruiter') {
            return res.status(400).json({ message: 'User is not a recruiter' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/profile/candidate/:id
// @desc    Get candidate profile
// @access  Public (or Protected if middleware added)
router.get('/candidate/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'candidate') {
            return res.status(400).json({ message: 'User is not a candidate' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
