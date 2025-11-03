"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = require("../utils/logger");
const errorMiddleware = (err, req, res, next) => {
    // Log error
    logger_1.logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Default error
    const error = {
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    // Handle specific error types
    switch (true) {
        case err.name === 'ValidationError': // Mongoose validation error
            error.status = 400;
            break;
        case err.name === 'CastError': // Mongoose casting error
            error.message = 'Resource not found';
            error.status = 404;
            break;
        case err.name === 'JsonWebTokenError': // JWT error
            error.message = 'Invalid token';
            error.status = 401;
            break;
        case err.name === 'TokenExpiredError': // JWT expired
            error.message = 'Token expired';
            error.status = 401;
            break;
        default:
            error.status = err.status || 500;
    }
    res.status(error.status).json({
        success: false,
        error: {
            message: error.message,
            ...(error.stack && { stack: error.stack }),
        },
    });
};
exports.errorMiddleware = errorMiddleware;
