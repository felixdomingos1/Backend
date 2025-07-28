"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegisterInput = [
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
// Adicione mais validações conforme necessário
