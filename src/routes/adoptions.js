const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Adoption = require('../models/Adoption');
const Tree = require('../models/Tree');

const router = express.Router();

// POst /adoptions - Request to adopt a tree (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { treeId } = req.body;

        if(!treeId ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if(!mongoose.Types.ObjectId.isValid(treeId)) {
            return res.status(400).json({ message: 'Invalid tree id' });
        }

        const tree = await Tree.findById(treeId);
        if(!tree) {
            return res.status(404).json({ message: 'Tree not found' });
        }

        const adoption = new Adoption({
            treeId,
            userId: req.user.userId,
            status: 'PENDING'
        });

        await adoption.save();

        return res.status(201).json({ message: 'Adoption request created successfully' });
    } catch (err) {
        console.error('ADOPTION CREATE ERROR:', err);
        return res.status(500).json({ message: 'Server error' });
    }   
});

// GET /adoptions/me - Get adoption requests (protected, user only)
router.get('/me', auth, async (req, res) => {
    try {
        const adoptions = await Adoption.find({ userId: req.user.userId }).populate('treeId');
        return res.status(200).json(adoptions);
    } catch (err) {
        console.error('ADOPTIONS USER LIST ERROR:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// GET /adoptions - Get all adoption requests (protected, admin only)
router.get('/', auth, admin, async (req, res) => {
    try {
        const adoptions = await Adoption.find().populate('treeId').populate('userId');
        return res.status(200).json(adoptions);
    } catch (err) {
        console.error('ADOPTIONS ADMIN LIST ERROR:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /adoptions/:id/status - Update adoption status (protected, admin only)
router.patch('/:id/status', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid adoption id' });
        }

        const allowed = ['APPROVED', 'REJECTED'];
        if(!status || !allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const adoption = await Adoption.findByIdAndUpdate(id, { status }, { new: true });
        if(!adoption) {
            return res.status(404).json({ message: 'Adoption not found' });
        }

        return res.status(200).json(adoption);
    } catch (err) {
        console.error('ADOPTION STATUS UPDATE ERROR:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;