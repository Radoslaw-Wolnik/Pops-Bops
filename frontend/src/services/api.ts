// frontend/src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { User, FullUser, Credentials, UserData, AudioSettings, Collection, Preset, AudioSample } from '../types';

const API_URL = "http://localhost:5000/api";

// Create a more flexible Axios instance with generics
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type assertion for methods
const typedApi = api as {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
} & AxiosInstance;

// Set up an interceptor for requests
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

// API functions with proper typing
//export const login = (credentials: Credentials): Promise<AxiosResponse<{ token: string; user: User }>> => 
//  typedApi.post('/users/login', credentials);

export const login = async (credentials: Credentials): Promise<AxiosResponse<{ token: string; user: User }>> => {
  try {
    const response = await typedApi.post<{ token: string; user: User }>('/users/login', credentials);
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
  typedApi.post('/users/logout');

export const register = async (userData: UserData): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await typedApi.post<{ message: string }>('/users/register', userData);
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


export const getMe = (): Promise<AxiosResponse<FullUser>> => 
  typedApi.get('/users/me');

export const getOtherUserProfile = (userId: string): Promise<AxiosResponse<User>> => 
  typedApi.get(`/users/${userId}`);


// Istnieje opcja że tu FullUser
export const updateUserProfile = (formData: FormData): Promise<AxiosResponse<User>> =>
  typedApi.put<User>('/users/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const changePassword = (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<void>> => 
  typedApi.put('/users/change-password', data);

export const sendVerificationEmail = (): Promise<AxiosResponse<void>> => 
  typedApi.post('/users/send-verification');

export const verifyEmail = (token: string): Promise<AxiosResponse<void>> => 
  typedApi.get(`/users/verify-email/${token}`);



export const savePreset = (preset: { name: string; settings: AudioSettings }): Promise<AxiosResponse<Preset>> =>
  typedApi.post('/presets', preset);

export const getCollections = (): Promise<AxiosResponse<Collection[]>> =>
  typedApi.get('/collections');

export const createCollection = (collection: { name: string }): Promise<AxiosResponse<Collection>> =>
  typedApi.post('/collections', collection);

export const addToCollection = (collectionId: string, sampleIds: string[]): Promise<AxiosResponse<Collection>> =>
  typedApi.post(`/collections/${collectionId}/add`, { sampleIds });

export const saveAudioSample = (audioBlob: Blob, settings: AudioSettings): Promise<AxiosResponse<AudioSample>> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'sample.wav');
  formData.append('settings', JSON.stringify(settings));
  return typedApi.post('/samples', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getAudioSamples = (): Promise<AxiosResponse<AudioSample[]>> =>
  typedApi.get('/samples');

export const getPresets = (): Promise<AxiosResponse<Preset[]>> =>
  typedApi.get('/presets');

export const deletePreset = (presetId: string): Promise<AxiosResponse<void>> =>
  typedApi.delete(`/presets/${presetId}`);

export default typedApi;