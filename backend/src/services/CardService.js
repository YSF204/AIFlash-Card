const Card = require('../models/Card');

/**
 * S — Single Responsibility: all card DB operations live here.
 * O — Open/Closed: extend via subclass for different card types.
 * D — Dependency Inversion: controllers import this, not the model directly.
 */
class CardService {
  /**
   * Get all cards for a user, sorted by dueScore descending.
   */
  async getByUser(userId) {
    return Card.find({ userId }).sort({ dueScore: -1, createdAt: -1 });
  }

  /**
   * Create a new card for a user.
   */
  async create({ userId, question, answer }) {
    const card = new Card({ userId, question, answer });
    return card.save();
  }

  /**
   * Update a card's spaced-repetition data.
   * @param {string} cardId
   * @param {string} userId  - validated ownership
   * @param {'correct'|'wrong'} result
   */
  async recordResult(cardId, userId, result) {
    const card = await Card.findOne({ _id: cardId, userId });
    if (!card) throw Object.assign(new Error('Card not found'), { status: 404 });

    card.lastSeen = new Date();
    if (result === 'wrong') {
      card.wrongCount += 1;
    } else {
      card.correctCount += 1;
    }
    return card.save(); // pre-save hook recomputes dueScore
  }

  /**
   * Delete a card (ownership enforced).
   */
  async delete(cardId, userId) {
    const card = await Card.findOneAndDelete({ _id: cardId, userId });
    if (!card) throw Object.assign(new Error('Card not found'), { status: 404 });
    return card;
  }
}

module.exports = new CardService();
