export interface StudySubscriptionForm {
  name: string;
  email: string;
  contact: string;
  titleStudy: string;
  address: string;
  message?: string;
}

export interface StudySubscriptionResponse {
  success: boolean;
  studySubscription?: any;
  message?: string;
}