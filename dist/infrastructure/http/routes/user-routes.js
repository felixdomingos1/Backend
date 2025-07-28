"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/http/routes/user-routes.ts
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user-controller");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'SUPER_ADMIN']), user_controller_1.GetAllUsers);
router.get('/:id', auth_1.authenticate, user_controller_1.GetUserProfile);
router.put('/:id', auth_1.authenticate, user_controller_1.UpdateUser);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['ADMIN', 'SUPER_ADMIN']), user_controller_1.DeleteUser);
exports.default = router;
