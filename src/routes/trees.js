const express = require('express');
const router = express.Router();
const Tree = require('../models/Tree');
const mongoose = require('mongoose');

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

// GET /trees/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // invalid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tree ID' });
    }

    // find tree by ID
    const tree = await Tree.findById(id);
    if (!tree) {
      return res.status(404).json({ message: 'Tree not found' });
    }

    return res.status(200).json(tree);
  } catch (err) {
    console.error('TREE BY ID ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
