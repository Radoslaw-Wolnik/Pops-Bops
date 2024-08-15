// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { User, FullUser, LoginCredentials, RegisterUserData, Collection, AudioSample, RegisterAdminData, LoginFetch } from '../types';

const API_URL = "https://localhost:5000/api";

// Create a more flexible Axios instance with generics
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for sending cookies
});

// Type assertion for methods
const typedApi = api as {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
} & AxiosInstance;

// Set up an interceptor for requests
/*
typedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
*/

// Custom ApiError class
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/*
If you know the exact structure of your API's error responses, you could create a more specific type for error.response.data
This would provide even better type safety, but it requires that you know and define the structure of your API's error responses.

interface APIErrorResponse {
  message: string;
  // Add any other properties your API might return in error responses
}

// Then in the error handler:
const errorData = error.response.data as APIErrorResponse;
throw new ApiError(error.response.status, errorData.message || 'An error occurred');
*/


// Error handling middleware
typedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorMessage = typeof error.response.data === 'object' && error.response.data !== null
        ? (error.response.data as any).message || 'An error occurred'
        : 'An error occurred';
      throw new ApiError(error.response.status, errorMessage);
    } else if (error.request) {
      throw new ApiError(0, 'No response received from server');
    } else {
      throw new ApiError(0, error.message);
    }
  }
);

// ---- API functions ----

export const login = async (credentials: LoginCredentials): Promise<AxiosResponse<{ message: string, user: LoginFetch }>> => {
  try {
    const response = await typedApi.post<{ message: string, user: LoginFetch }>('/auth/login', credentials);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          throw new ApiError(400, 'Invalid credentials');
        case 401:
          throw new ApiError(401, 'Please verify your email before logging in');
        default:
          throw new ApiError(error.statusCode, 'An error occurred during login');
      }
    }
    throw error;
  }
};

export const logout = (): Promise<AxiosResponse<void>> => 
  typedApi.post('/auth/logout');

export const register = async (userData: RegisterUserData): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await typedApi.post<{ message: string }>('/auth/register', userData);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          throw new ApiError(400, 'Email already in use');
        case 401:
          throw new ApiError(400, 'Username already taken');
        default:
          throw new ApiError(error.statusCode, 'An error occurred during registration');
      }
    }
    throw error;
  }
};

export const refreshAuthToken = async (): Promise<AxiosResponse<{ message: string, user: LoginFetch }>> => {
  try {
    const response = await typedApi.post<{ message: string, user: LoginFetch }>('/auth/refresh-token');
    return response;
  } catch (error) {
    throw(error);
  }
};

export const changePassword = (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<void>> => 
  typedApi.put('/auth/change-password', data);

export const sendVerificationEmail = (): Promise<AxiosResponse<void>> => 
  typedApi.post('/auth/send-verification');

export const verifyEmail = (token: string): Promise<AxiosResponse<void>> => 
  typedApi.get(`/auth/verify-email/${token}`);



export const updateUserProfile = (formData: FormData): Promise<AxiosResponse<User>> =>
  typedApi.put<User>('/users/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });




export const getMe = (): Promise<AxiosResponse<FullUser>> => 
  typedApi.get('/users/me');

export const getOtherUserProfile = (userId: string): Promise<AxiosResponse<User>> => 
  typedApi.get(`/users/${userId}`);

export const getMainPageSamples = (): Promise<AxiosResponse<AudioSample[]>> =>
  typedApi.get('/audio/main-samples');

export const getUserSamples = (): Promise<AxiosResponse<AudioSample[]>> =>
  typedApi.get('/audio/my-samples/user');

// not sure if it shouldnt be /audio./upload-audio
export const createAudioSample = (formData: FormData): Promise<AxiosResponse<AudioSample>> =>
  typedApi.post('audio/user-audio-sample', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateAudioSampleIcon = (sampleId: string, formData: FormData): Promise<AxiosResponse<AudioSample>> =>
  typedApi.put(`/audio/user-audio-sample/${sampleId}/icon`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getUserCollections = (): Promise<AxiosResponse<Collection>> =>
  typedApi.get('/audio/collections');


// admin ---- TODO
export const addDefaultAudioSample = (formData: FormData): Promise<AxiosResponse<AudioSample>> =>
  typedApi.post('/admin/samples', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAdmins = (): Promise<AxiosResponse<User[]>> =>
  typedApi.get('/admin/users');

export const deleteAdmin = (id: string): Promise<AxiosResponse<void>> =>
  typedApi.delete(`/admin/users/${id}`);

export const addAdmin = (adminData: RegisterAdminData ): Promise<AxiosResponse<User>> =>
  typedApi.post('/admin/users', adminData);

export default typedApi;