// src/services/api.ts

import axios, { AxiosResponse } from 'axios';
import { User, LoginCredentials, RegisterData, AudioSample, Collection, ApiResponse, ErrorResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Helper function to handle errors
const handleError = (error: any): never => {
  if (error.response) {
    throw error.response.data as ErrorResponse;
  }
  throw error;
};

// Auth endpoints
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw handleError(error);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

// User endpoints
export const updateProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.put<ApiResponse<string>>('/users/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

// Audio sample endpoints
export const getMainPageSamples = async (): Promise<AudioSample[]> => {
  try {
    const response = await api.get<ApiResponse<AudioSample[]>>('/audio/main-samples');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserSamples = async (): Promise<AudioSample[]> => {
  try {
    const response = await api.get<ApiResponse<AudioSample[]>>('/audio/my-samples');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const createAudioSample = async (data: FormData): Promise<AudioSample> => {
  try {
    const response = await api.post<ApiResponse<AudioSample>>('/audio/upload/sample-with-icon', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const updateAudioSample = async (sampleId: string, data: Partial<AudioSample>): Promise<AudioSample> => {
  try {
    const response = await api.put<ApiResponse<AudioSample>>(`/audio/sample/${sampleId}`, data);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteAudioSample = async (sampleId: string): Promise<void> => {
  try {
    await api.delete(`/audio/sample/${sampleId}`);
  } catch (error) {
    throw handleError(error);
  }
};

// Collection endpoints
export const getUserCollections = async (): Promise<Collection[]> => {
  try {
    const response = await api.get<ApiResponse<Collection[]>>('/collections');
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const createCollection = async (name: string): Promise<Collection> => {
  try {
    const response = await api.post<ApiResponse<Collection>>('/collections', { name });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCollection = async (collectionId: string, data: Partial<Collection>): Promise<Collection> => {
  try {
    const response = await api.put<ApiResponse<Collection>>(`/collections/${collectionId}`, data);
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  try {
    await api.delete(`/collections/${collectionId}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const addToCollection = async (collectionId: string, sampleIds: string[]): Promise<Collection> => {
  try {
    const response = await api.post<ApiResponse<Collection>>(`/collections/${collectionId}/add`, { sampleIds });
    return handleResponse(response);
  } catch (error) {
    throw handleError(error);
  }
};

export const removeFromCollection = async (collectionId: string, sampleId: string): Promise<void> => {
  try {
    await api.delete(`/collections/${collectionId}/samples/${sampleId}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const searchSamplesAndCollections = async (query: string): Promise<{ samples: AudioSample[], collections: Collection[] }> => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};


export const updateCollectionOrder = async (collectionIds: string[]): Promise<void> => {
  await api.put('/collections/order', { collectionIds });
};


export default api;