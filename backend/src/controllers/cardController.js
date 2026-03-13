const cardService = require('../services/CardService');

/**
 * S — Single Responsibility: HTTP card request/response cycle only.
 * D — Dependency Inversion: depends on CardService abstraction.
 */

const getCards = async (req, res, next) => {
  try {
    const cards = await cardService.getByUser(req.user._id);
    res.json({ success: true, data: cards });
  } catch (err) { next(err); }
};

const createCard = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer)
      return res.status(400).json({ success: false, message: 'question and answer are required' });
    const card = await cardService.create({ userId: req.user._id, question, answer });
    res.status(201).json({ success: true, data: card });
  } catch (err) { next(err); }
};

const updateCard = async (req, res, next) => {
  try {
    const { result } = req.body; // 'correct' | 'wrong'
    if (!['correct', 'wrong'].includes(result))
      return res.status(400).json({ success: false, message: 'result must be correct or wrong' });
    const card = await cardService.recordResult(req.params.id, req.user._id, result);
    res.json({ success: true, data: card });
  } catch (err) { next(err); }
};

const deleteCard = async (req, res, next) => {
  try {
    await cardService.delete(req.params.id, req.user._id);
    res.json({ success: true, message: 'Card deleted' });
  } catch (err) { next(err); }
};

module.exports = { getCards, createCard, updateCard, deleteCard };
