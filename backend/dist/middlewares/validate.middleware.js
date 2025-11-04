"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validateMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : err.type,
                message: err.msg,
            })),
        });
    }
    next();
};
exports.validateMiddleware = validateMiddleware;
