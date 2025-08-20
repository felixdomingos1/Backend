import { prisma } from '../../infrastructure/database/prisma';
import { StudySubscriptionForm, StudySubscriptionResponse } from '@/types/study-subscription';

export const createStudySubscription = async (subscriptionData: StudySubscriptionForm): Promise<StudySubscriptionResponse> => {
  try {
    if (!subscriptionData.email || !subscriptionData.name || !subscriptionData.contact || !subscriptionData.address) {
      throw new Error('All fields are required except message');
    }

    const studySubscription = await prisma.studySubscription.create({
      data: {
        name: subscriptionData.name,
        email: subscriptionData.email,
        titleStudy: subscriptionData.titleStudy,
        contact: subscriptionData.contact,
        address: subscriptionData.address,
        message: subscriptionData.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return { success: true, studySubscription };
  } catch (error: any) {
    console.error('Study subscription creation error:', error);
    return { success: false, message: 'Study subscription failed' };
  }
};

export const getAllStudySubscriptions = async (pagination: any) => {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const [total, studySubscriptions] = await Promise.all([
    prisma.studySubscription.count(),
    prisma.studySubscription.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    data: studySubscriptions,
    pagination: {
      total,
      totalPages: Math.ceil(total / pageSize),
      page,
      pageSize
    }
  };
};