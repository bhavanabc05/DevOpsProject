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
    console.log('Saving message body:', req.body);  // ← add this
    const { text, originalText, wasCorrected, tone } = req.body;

    if (!text || !originalText) {
      return res.status(400).json({ error: 'text and originalText are required' });
    }

    const message = new Message({ text, originalText, wasCorrected, tone });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Message save error:', err.message);  // ← add this
    res.status(500).json({ error: err.message });       // ← return actual error
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