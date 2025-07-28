"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("tsconfig-paths/register");
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const server = app_1.default.listen(env_1.default.PORT, () => {
    console.log(`Server running on port ${env_1.default.PORT}`);
});
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${env_1.default.PORT} is already in use`);
    }
    else {
        console.error('Server error:', error);
    }
});
