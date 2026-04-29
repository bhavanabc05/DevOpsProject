const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text:         { type: String, required: true },
  originalText: { type: String, required: true },
  wasCorrected: { type: Boolean, default: false },
  tone:         { type: String, default: 'formal' },
  sender:       { type: String, default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);