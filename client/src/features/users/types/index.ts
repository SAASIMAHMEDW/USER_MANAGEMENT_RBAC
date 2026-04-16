export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: { _id: string; name: string; email: string } | null;
  updatedBy?: { _id: string; name: string; email: string } | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'user';
  status?: 'active' | 'inactive';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'admin' | 'manager' | 'user';
  status?: 'active' | 'inactive';
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleUserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface CreateUserResponse {
  success: boolean;
  data: {
    user: User;
    generatedPassword?: string;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    inactive: number;
    managers: number;
  };
}
