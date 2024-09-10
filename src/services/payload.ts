import jwt from 'jsonwebtoken';
import auth from '../config/auth';

export const generateToken = (id: number) : string => {
  return jwt.sign({ id }, auth.key, { expiresIn:auth.expiresIn});
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
