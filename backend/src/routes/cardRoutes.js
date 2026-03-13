const express = require('express');
const { getCards, createCard, updateCard, deleteCard } = require('../controllers/cardController');
const auth = require('../middleware/auth');

/**
 * I — Interface Segregation: card routes isolated.
 * All routes protected by JWT auth middleware.
 */
const router = express.Router();

router.use(auth); // apply JWT check to all card routes

router.get('/',        getCards);
router.post('/',       createCard);
router.patch('/:id',  updateCard);
router.delete('/:id', deleteCard);

module.exports = router;
