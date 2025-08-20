import { prisma } from '../../infrastructure/database/prisma';
import { BookingForm, BookingResponse } from '@/types/booking';

export const createBooking = async (bookingData: BookingForm): Promise<BookingResponse> => {
  try {
    if (!bookingData.email || !bookingData.name || !bookingData.preferredDate) {
      throw new Error('Email, name and preferred date are required');
    }

    const booking = await prisma.booking.create({
      data: {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        preferredDate: bookingData.preferredDate,
        message: bookingData.message || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return { success: true, booking, message: 'Booking created successfully' };
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return { 
      success: false, 
      message: error.message.includes('Unique constraint') 
        ? 'Booking already exists' 
        : 'Booking creation failed' 
    };
  }
};

export const getAllBookings = async (pagination: any) => {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [total, bookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    data: bookings,
    pagination: {
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize
    }
  };
};