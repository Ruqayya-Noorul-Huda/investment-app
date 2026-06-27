const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const prompt = `
      You are a helpful investment advisor. Based on the following user profile, 
      give 5 simple, beginner-friendly investment suggestions. 
      Format each suggestion with a title and 2-3 lines of explanation.

      User Profile:
      - Name: ${user.name}
      - Investment Budget: ₹${user.budget}
      - Interests: ${user.interests.join(', ')}
      - Risk Level: ${user.riskLevel}

      Keep the language simple and easy to understand for a first-time investor.
      Add a short disclaimer at the end that this is AI-generated advice 
      and not professional financial advice.
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });

    const suggestions = response.choices[0].message.content;
    res.json({ suggestions });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ message: 'AI error, try again' });
  }
});

module.exports = router;