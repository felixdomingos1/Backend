"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("@config/env"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: env_1.default.EMAIL_USER,
        pass: env_1.default.EMAIL_PASS
    }
});
const sendEmail = async (options) => {
    await transporter.sendMail({
        from: `"My App" <${env_1.default.EMAIL_USER}>`,
        ...options
    });
};
exports.sendEmail = sendEmail;
