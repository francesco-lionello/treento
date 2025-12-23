const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// POST /reports - Create a new report (protected)
router.post('/', auth, async (req, res) => {
  const { title, location } = req.body;

  // Required fields
  if (!title || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // We only acknowledge creation without persistence details
  return res.status(201).json({ message: 'Report created successfully' });
});

module.exports = router;

