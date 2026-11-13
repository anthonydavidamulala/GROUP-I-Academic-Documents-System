function errorHandler(error, req, res, next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(400).json({ error: 'Request body is too large' });
  }

  // Log a short diagnostic code, never credentials, SQL values, or stack traces.
  console.error('Request failed:', error.code || 'INTERNAL_ERROR');
  res.status(500).json({ error: 'Unable to complete the request. Please try again later.' });
}

module.exports = errorHandler;
