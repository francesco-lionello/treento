const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');

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

module.exports = router;

