/**
 * Centralized error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log the full stack trace for debugging
  console.error('Unhandled Server Error:', err);

  // Set default status code if none was provided
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Clean, standardized response payload
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // Only send stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
