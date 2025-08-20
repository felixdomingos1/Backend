import { Request, Response } from 'express';
import { createBooking, getAllBookings } from '@/application/services/booking-service';
import { BookingForm } from '@/types/booking';

export const CreateBooking = async (req: Request, res: Response) => {
    try {
        const bookingData: BookingForm = req.body;
        const result = await createBooking(bookingData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const GetAllBookings = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await getAllBookings({ page, pageSize });
        res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get bookings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};