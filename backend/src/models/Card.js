const mongoose = require('mongoose');

/**
 * S — Single Responsibility: Card schema + spaced-repetition fields only.
 */
const cardSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    question:     { type: String, required: true },
    answer:       { type: String, required: true },
    // Spaced repetition
    wrongCount:   { type: Number, default: 0, min: 0 },
    correctCount: { type: Number, default: 0, min: 0 },
    dueScore:     { type: Number, default: 0 },   // higher = more urgent
    lastSeen:     { type: Date,   default: null },
  },
  { timestamps: true }
);

// Recompute dueScore before each save (O — open for extension via model hooks)
cardSchema.pre('save', async function () {
  const daysSinceSeen = this.lastSeen
    ? (Date.now() - new Date(this.lastSeen).getTime()) / 86400000
    : 99;
  this.dueScore = this.wrongCount * 3 + daysSinceSeen;
});

module.exports = mongoose.model('Card', cardSchema);
