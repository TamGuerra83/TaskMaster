

export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  location?: LocationData;
  photoUri?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}