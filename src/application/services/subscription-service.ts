import { prisma } from '../../infrastructure/database/prisma';
import { SubscriptionForm, SubscriptionResponse } from '@/types/subscription';

export const createSubscription = async (subscriptionData: SubscriptionForm): Promise<SubscriptionResponse> => {
  try {
    if (!subscriptionData.email) {
      throw new Error('Email is required');
    }

    const existingSubscription = await prisma.subscription.findUnique({
      where: { email: subscriptionData.email }
    });

    if (existingSubscription) {
      return { 
        success: false, 
        message: 'Email already subscribed' 
      };
    }

    const subscription = await prisma.subscription.create({
      data: {
        email: subscriptionData.email,
        name: subscriptionData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return { success: true, subscription };
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    return { success: false, message: 'Subscription failed' };
  }
};

export const getAllSubscriptions = async (pagination: any) => {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [total, subscriptions] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    data: subscriptions,
    pagination: {
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize
    }
  };
};