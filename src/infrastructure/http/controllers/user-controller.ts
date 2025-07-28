// src/infrastructure/http/controllers/user-controller.ts
import { Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '@/application/services/user-service';
import { PaginationOptions } from '@/types/pagination';


export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const paginationOptions: PaginationOptions = {
      page,
      pageSize
    };

    const result = await getAllUsers(paginationOptions);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const GetUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user profile' });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updatedUser = await updateUser(
      userId,
      req.user.id,
      req.user.role,
      updateData
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    const status = error.message.includes('Unauthorized') ? 403 :
      error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await deleteUser(userId, req.user.role);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    const status = error.message.includes('Unauthorized') ? 403 :
      error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};