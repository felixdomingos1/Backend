"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const edge_1 = require("@prisma/client/edge");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const prismaClientSingleton = () => {
    return new edge_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
};
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = exports.prisma;
