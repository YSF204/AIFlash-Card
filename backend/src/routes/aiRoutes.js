const express = require('express');
const { generateCard } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.post('/generate', generateCard);

module.exports = router;
