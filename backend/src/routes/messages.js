const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/messages — fetch all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages — save a new message
router.post('/', async (req, res) => {
  try {
    console.log('📥 Save request body:', req.body);
    const { text, originalText, wasCorrected, tone } = req.body;
    const message = new Message({ text, originalText, wasCorrected, tone });
    const saved = await message.save();
    console.log('✅ Saved successfully:', saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messages — clear all messages
router.delete('/', async (req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ message: 'Chat cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

module.exports = router;