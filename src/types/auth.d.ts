export interface UserRegisterData {
  name: string
  email: string
  password: string
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface UserLoginData {
  email: string
  password: string
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        role: string
      }
      ip?: string
    }
  }
}