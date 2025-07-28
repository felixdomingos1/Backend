"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = __importDefault(require("./config/env"));
const rate_limit_1 = require("./infrastructure/http/middlewares/rate-limit");
const routes_1 = __importDefault(require("./infrastructure/http/routes"));
const request_ip_1 = __importDefault(require("request-ip"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Especifique a origem exata
    credentials: true, // Permite credenciais (cookies, headers de autenticação)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(rate_limit_1.apiLimiter);
app.use(request_ip_1.default.mw());
app.use('/api/v1', routes_1.default);
app.use((req, res, next) => {
    if (req.url === '/favicon.ico') {
        res.status(204).end();
    }
    else {
        next();
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});
app.listen(env_1.default.PORT, () => {
    console.log(`Server running on port ${env_1.default.PORT} in ${env_1.default.NODE_ENV} mode`);
});
exports.default = app;
