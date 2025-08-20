export interface BookingForm {
  name: string;
  email: string;
  phone?: string;
  preferredDate: Date;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: any;
  message?: string;
}