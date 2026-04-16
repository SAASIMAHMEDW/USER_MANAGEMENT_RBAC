export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'manager' | 'user';
      status: 'active' | 'inactive';
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
