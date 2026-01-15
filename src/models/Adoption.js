const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
    treeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tree', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
    }, { timestamps: true });

module.exports = mongoose.model('Adoption', AdoptionSchema);