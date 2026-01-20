const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Report = require('../models/Report');
const mongoose = require('mongoose');

// POST /reports - Create a new report (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, location } = req.body;

    // Required fields
    if (!title || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Persist report linked to authenticated user
    const report = new Report({
      title,
      location,
      userId: req.user.userId
    });
    
    await report.save();

    // Keep response simple (coherent with Template 3)
    return res.status(201).json({ message: 'Report created successfully' });
  } catch (err) {
    console.error('REPORT CREATE ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /reports/me - Get reports created by the authenticated user (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (err) {
    console.error('REPORTS ME ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /reports/admin - Get all reports (protected, admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (err) {
    console.error('REPORTS ADMIN LIST ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /reports/:id/status - Update report status (protected, admin only)
router.patch('/:id/status', auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid report id' });
    }

    const allowed = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (err) {
    console.error('REPORT STATUS UPDATE ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

