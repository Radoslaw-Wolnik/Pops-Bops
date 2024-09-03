// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { User, FullUser, LoginCredentials, RegisterUserData, Collection, AudioSample, RegisterAdminData, LoginFetch } from '../types';

import { getEnv } from '../config/enviorement'
const env = await getEnv();
// const API_URL: string = import.meta.env.VITE_API_URL;

// Create a more flexible Axios instance with generics
const api = axios.create({
  baseURL: env.API_URL,
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


// Custom ApiError class
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Global error handler
const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    const statusCode = error.response.status;
    const errorMessage = typeof error.response.data === 'object' && error.response.data !== null
      ? (error.response.data as any).message || 'An error occurred'
      : 'An error occurred';

    switch (statusCode) {
      case 400:
        throw new ApiError(400, 'Bad request. Please check your input.');
      case 401:
        throw new ApiError(401, 'Unauthorized. Please log in.');
      case 403:
        throw new ApiError(403, 'Forbidden. You do not have permission to perform this action.');
      case 404:
        throw new ApiError(404, 'Resource not found.');
      case 500:
        throw new ApiError(500, 'Internal server error. Please try again later.');
      default:
        throw new ApiError(statusCode, errorMessage);
    }
  } else if (error.request) {
    throw new ApiError(0, 'No response received from server');
  } else {
    throw new ApiError(0, error.message);
  }
};


// API function wrapper for consistent error handling
const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response: AxiosResponse<T>;
    switch (method) {
      case 'get':
        response = await typedApi.get<T>(url, config);
        break;
      case 'post':
        response = await typedApi.post<T>(url, data, config);
        break;
      case 'put':
        response = await typedApi.put<T>(url, data, config);
        break;
      case 'delete':
        response = await typedApi.delete<T>(url, config);
        break;
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleApiError(error);
    }
    throw error;
  }
};

/* API arrow functions can be changed to use explecitly async keyword but it is not necessary
 * without:
 * export const logout = async (): Promise<void> => 
 *   apiRequest('post', '/auth/logout');
 * with:
 * export const logout = async (): Promise<void> => {
 *   await apiRequest('post', '/auth/logout');
 * };
 * or if it returns sth then
 *   return await ...
*/

// ---- API functions ----

export const login = async (credentials: LoginCredentials): Promise<{ message: string, user: LoginFetch }> => {
  try {
    // const response = await typedApi.post<{ message: string, user: LoginFetch }>('/auth/login', credentials);
    // return response;
    return await apiRequest('post', '/auth/login', credentials);
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          throw new ApiError(400, 'Invalid credentials');
        case 401:
          throw new ApiError(401, 'Please verify your email before logging in');
        default:
          throw error;
      }
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => 
  apiRequest('post', '/auth/logout');

export const register = async (userData: RegisterUserData): Promise<{ message: string }> => {
  try {
    return await apiRequest('post', '/auth/register', userData);
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          throw new ApiError(400, 'Email already in use');
        case 401:
          throw new ApiError(400, 'Username already taken');
        default:
          throw error;
      }
    }
    throw error;
  }
};

export const refreshAuthToken = async (): Promise<{ message: string, user: LoginFetch }> => {
  try {
    return await apiRequest('post', '/auth/refresh-token');
  } catch (error) {
    throw(error);
  }
};

export const changePassword = (data: { currentPassword: string; newPassword: string }): Promise<void> => 
  apiRequest('put', '/auth/change-password', data);

export const sendVerificationEmail = (): Promise<void> => 
  apiRequest('post', '/auth/send-verification');

export const verifyEmail = (token: string): Promise<void> => 
  apiRequest('get', `/auth/verify-email/${token}`);

export const requestPasswordReset = (email: string): Promise<{ message: string }> =>
  apiRequest('post', '/auth/request-password-reset', email);

export const resetPassword = (token: string): Promise<{ message: string }> => 
  apiRequest('post', `/auth/reset-password/${token}`);

export const updateUserProfile = (formData: FormData): Promise<User> =>
  apiRequest('put', '/users/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });




export const getMe = (): Promise<FullUser> => 
  apiRequest('get', '/users/me');

export const getOtherUserProfile = (userId: string): Promise<User> => 
  apiRequest('get', `/users/${userId}`);

export const getMainPageSamples = (): Promise<AudioSample[]> =>
  apiRequest('get', '/audio/main-samples');

export const getUserSamples = (): Promise<AudioSample[]> =>
  apiRequest('get', `/audio/my-samples`);

export const deleteUserSample = (sample: AudioSample): Promise<{ message: string }> =>
  apiRequest('delete', `/audio/sample/${sample._id}`);

export const deleteDefaultSample = (sample: AudioSample): Promise<{ message: string }> =>
  apiRequest('delete', `/audio/default-sample/${sample._id}`);

export const deleteUserCollection = (collection: Collection): Promise<{ message: string }> =>
  apiRequest('delete', `/audio/collection/${collection._id}`);

// not sure if it shouldnt be /audio./upload-audio
export const createAudioSample = (formData: FormData): Promise<AudioSample> =>
  apiRequest('post', 'audio/user-audio-sample', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateAudioSampleIcon = (sampleId: string, formData: FormData): Promise<AudioSample> =>
  apiRequest('put', `/audio/user-audio-sample/${sampleId}/icon`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getUserCollections = (): Promise<Collection[]> =>
  apiRequest('get', '/audio/collections');

export const createCollection = (collectionName: string): Promise<Collection> => 
  apiRequest('post', '/audio/collections', { name: collectionName });

export const addToCollection = (collectionId: string, audioSampleIds: string[]): Promise<void> => 
  apiRequest('post', `/audio/collections/${collectionId}/add`, { audioSampleIds });





// admin ---- TODO
export const addDefaultAudioSample = (formData: FormData): Promise<AudioSample> =>
  apiRequest('post', '/admin/samples', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAdmins = async (): Promise<User[]> =>
  apiRequest('get', '/admin/users');

export const deleteAdmin = async (id: string): Promise<void> =>
  apiRequest('delete', `/admin/users/${id}`);

export const addAdmin = async (adminData: RegisterAdminData): Promise<User> =>
  apiRequest('post', '/admin/users', adminData);

export default typedApi;