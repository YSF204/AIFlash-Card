const aiService = require('../services/AIService');

/**
 * S — Single Responsibility: AI HTTP request/response cycle only.
 */
const generateCard = async (req, res, next) => {
  try {
    const { text, count = 5 } = req.body;
    if (!text || text.trim().length < 10)
      return res.status(400).json({ success: false, message: 'text must be at least 10 characters' });
    const cards = await aiService.generateCards(text.trim(), Math.min(Number(count) || 5, 10));
    res.json({ success: true, data: cards });
  } catch (err) { next(err); }
};

module.exports = { generateCard };
