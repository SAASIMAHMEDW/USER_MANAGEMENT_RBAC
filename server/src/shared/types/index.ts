import { Request } from 'express';
import { Role } from '../constants/roles';

export interface UserPayload {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
