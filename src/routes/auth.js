const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

  // Validate email format
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ message: 'Invalid email format' });
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

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Require fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ 
      message: 'Invalid email or password' 
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ 
      message: 'Invalid email or password' 
    });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return res.status(200).json({ 
    token 
  });
});

// module.exports = router for use in other files
module.exports = router;