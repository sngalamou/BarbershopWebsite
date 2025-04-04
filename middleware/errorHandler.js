const errorHandler = (err, req, res, next) => {
    // Log error for server side visibility
    console.error(err.stack);
    
    // Determine status code: default to 500 if not specified
    const statusCode = err.statusCode || 500;
    
    // Create error response
    const errorResponse = {
      error: {
        message: err.message || 'Internal Server Error',
        status: statusCode
      }
    };
    
    // Include stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
    }
    
    // Send error response
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = errorHandler;