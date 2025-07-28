"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../../config/env"));
const prisma_1 = require("../../database/prisma");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const setupLimiter = () => {
    return new rate_limiter_flexible_1.RateLimiterMemory({
        points: 1, // 1 tentativa
        duration: 60, // 1 minuto inicial
    });
};
const fibonacciLimiter = setupLimiter();
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id, isActive: true },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found or inactive' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            try {
                const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
                const resConsume = await fibonacciLimiter.consume(clientIp);
                const fibonacciSequence = [60, 120, 180, 300, 480, 780];
                const altSequence = [600, 1200, 1800, 3000, 4800, 7800];
                const attempts = resConsume.consumedPoints;
                let nextDuration = 60;
                if (attempts > 1) {
                    const sequence = attempts >= 7 ? altSequence : fibonacciSequence;
                    const index = Math.min((attempts >= 7 ? attempts - 7 : attempts - 1), sequence.length - 1);
                    nextDuration = sequence[index];
                }
                return res.status(403).json({
                    success: false,
                    message: `Forbidden. Try again in ${nextDuration / 60} minutes`,
                    retryAfter: nextDuration
                });
            }
            catch (rlRejected) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many attempts. Please try again later.'
                });
            }
        }
        next();
    };
};
exports.authorize = authorize;
