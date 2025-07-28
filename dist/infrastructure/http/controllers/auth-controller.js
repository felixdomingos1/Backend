"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performReset = exports.requestReset = exports.profile = exports.login = exports.register = void 0;
const auth_service_1 = require("../../../application/services/auth-service");
const prisma_1 = require("../../database/prisma");
const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await (0, auth_service_1.registerUser)(userData);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Registration controller error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const loginData = req.body;
        const result = await (0, auth_service_1.loginUser)(loginData);
        if (!result.success) {
            return res.status(401).json(result);
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Login controller error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
const profile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error('Profile controller error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.profile = profile;
const requestReset = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await (0, auth_service_1.requestPasswordReset)(email);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to request password reset'
        });
    }
};
exports.requestReset = requestReset;
const performReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await (0, auth_service_1.resetPassword)(token, newPassword);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to reset password'
        });
    }
};
exports.performReset = performReset;
