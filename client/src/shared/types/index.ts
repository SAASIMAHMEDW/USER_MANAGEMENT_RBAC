export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: { _id: string; name: string; email: string } | null;
  updatedBy?: { _id: string; name: string; email: string } | null;
}

export interface AuthState {
  user: Omit<User, 'password'> | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction =
  | { type: 'SET_AUTH'; payload: { user: Omit<User, 'password'>; accessToken: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_LOADING'; payload: boolean };
