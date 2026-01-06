const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, default: 'OPEN' }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);