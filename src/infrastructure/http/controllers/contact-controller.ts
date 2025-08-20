import { Request, Response } from 'express';
import { PaginationOptions } from '@/types/pagination';
import { contactUser, deleteContact, getAllContacts } from '@/application/services/contact-service';
import { ContactForm } from '@/types/contact';

export const CreateContact = async (req: Request, res: Response) => {
  try {
    const contactData: ContactForm = req.body;
    if (!contactData.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    const result = await contactUser(contactData);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create contact',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const GetAllContacts = async (req: Request, res: Response) => {
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

    const result = await getAllContacts(paginationOptions);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get all contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const DeleteContact = async (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await deleteContact(contactId, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete contact error:', error);
    const status = error.message.includes('Unauthorized') ? 403 :
      error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to delete contact'
    });
  }
};