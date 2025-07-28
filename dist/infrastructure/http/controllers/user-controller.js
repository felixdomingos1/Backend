"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.UpdateUser = exports.GetUserProfile = exports.GetAllUsers = void 0;
const user_service_1 = require("@/application/services/user-service");
const GetAllUsers = async (req, res) => {
    try {
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const paginationOptions = {
            page,
            pageSize
        };
        const result = await (0, user_service_1.getAllUsers)(paginationOptions);
        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.GetAllUsers = GetAllUsers;
const GetUserProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await (0, user_service_1.getUserById)(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to get user profile' });
    }
};
exports.GetUserProfile = GetUserProfile;
const UpdateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updateData = req.body;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const updatedUser = await (0, user_service_1.updateUser)(userId, req.user.id, req.user.role, updateData);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        const status = error.message.includes('Unauthorized') ? 403 :
            error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Failed to update user'
        });
    }
};
exports.UpdateUser = UpdateUser;
const DeleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        await (0, user_service_1.deleteUser)(userId, req.user.role);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        const status = error.message.includes('Unauthorized') ? 403 :
            error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message || 'Failed to delete user'
        });
    }
};
exports.DeleteUser = DeleteUser;
