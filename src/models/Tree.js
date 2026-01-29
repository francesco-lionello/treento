const mongoose = require('mongoose');

const TreeSchema = new mongoose.Schema({
  species: { type: String, required: true },
  scientificName: {type: String},
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

module.exports = mongoose.model('Tree', TreeSchema);


