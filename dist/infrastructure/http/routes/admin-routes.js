"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin-controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/create', auth_1.authenticate, (0, auth_1.authorize)(['SUPER_ADMIN']), admin_controller_1.createAdmin);
exports.default = router;
