require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const passport   = require('./src/config/passport');
const connectDB  = require('./src/config/db');

const authRoutes  = require('./src/routes/authRoutes');
const cardRoutes  = require('./src/routes/cardRoutes');
const aiRoutes    = require('./src/routes/aiRoutes');
const errorHandler = require('./src/middleware/errorHandler');

// ── Bootstrap ─────────────────────────────────────────────────
connectDB();

const app = express();

// ── Security & utility middleware ──────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));

// Rate limiting — 100 requests / 15 min per IP
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

// Passport (stateless — no sessions)
app.use(passport.initialize());

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/ai',    aiRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Global error handler (must be last) ───────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`));
