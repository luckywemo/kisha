const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let details = null;

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Validation failed';
    details = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
  }

  // Sequelize unique constraint errors
  else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Resource already exists';
    details = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`,
      value: error.value
    }));
  }

  // Sequelize foreign key constraint errors
  else if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Invalid reference';
    details = {
      field: err.fields[0],
      message: 'Referenced resource does not exist'
    };
  }

  // Sequelize database connection errors
  else if (err.name === 'SequelizeConnectionError') {
    status = 503;
    message = 'Database connection failed';
  }

  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Multer errors (file upload)
  else if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File too large';
  }
  else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    status = 400;
    message = 'Unexpected file field';
  }

  // Custom application errors
  else if (err.status) {
    status = err.status;
    message = err.message;
    details = err.details;
  }

  // Syntax errors (malformed JSON)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    message = 'Invalid JSON format';
  }

  // Rate limiting errors
  else if (err.status === 429) {
    status = 429;
    message = 'Too many requests';
  }

  // Permission errors
  else if (err.message && err.message.includes('permission')) {
    status = 403;
    message = 'Insufficient permissions';
  }

  // Not found errors
  else if (err.message && err.message.includes('not found')) {
    status = 404;
    message = err.message;
  }

  // Prepare error response
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add details if available
  if (details) {
    errorResponse.details = details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  res.status(status).json(errorResponse);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

// Request ID middleware
const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || 
           req.headers['x-correlation-id'] || 
           `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: err.message,
    stack: err.stack,
    request: {
      id: req.id,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    },
    user: req.user ? {
      id: req.user.id,
      email: req.user.email
    } : null
  };

  // Log to console (in production, this would go to a proper logging service)
  console.error('Error Log:', JSON.stringify(errorLog, null, 2));
  
  next(err);
};

// Health check error handler
const healthCheckErrorHandler = (err, req, res, next) => {
  if (req.path === '/health') {
    res.status(503).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    next(err);
  }
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  requestId,
  errorLogger,
  healthCheckErrorHandler
};





