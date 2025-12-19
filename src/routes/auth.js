const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Require fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ 
      message: 'User already exists' 
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = new User({ email, password: hashedPassword });
  await user.save();

  res.status(201).json({ 
    message: 'User created successfully' 
  });
});

// module.exports = router for use in other files
module.exports = router;