"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: 'documents',
            allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'mp4'],
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    }
});
exports.default = cloudinary_1.v2;
