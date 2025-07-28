import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
}