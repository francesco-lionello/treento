const express = require('express');
const router = express.Router();
const Tree = require('../models/Tree');

// GET /trees
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;

    // invalid parameters
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n <= 0) {
        return res.status(400).json({ message: 'Invalid query parameter' });
      }
    }

    // query trees from DB 
    const query = Tree.find();

    if (limit !== undefined) {
      query.limit(Number(limit));
    }

    // execute query and return results
    const trees = await query.exec();
    return res.status(200).json(trees);
  } catch (err) {
    console.error('TREES ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
