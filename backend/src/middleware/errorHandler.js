/**
 * S — Single Responsibility: global error formatting only.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const status  = err.status  || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} →`, err);
  }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
