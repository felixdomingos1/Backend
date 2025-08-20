export interface SubscriptionForm {
  email: string;
  name?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: any;
  message?: string;
}