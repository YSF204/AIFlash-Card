const mongoose = require('mongoose');

/**
 * S — Single Responsibility: User schema only.
 */
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email:    { type: String, required: true, unique: true },
    name:     { type: String, required: true },
    avatar:   { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
