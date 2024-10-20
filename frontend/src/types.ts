// User related types
export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Audio related types
export interface AudioSample {
  _id: string;
  name: string;
  audioUrl: string;
  iconUrl: string;
  forMainPage: boolean;
  user?: string; // Only for UserAudioSamples
}

export interface AudioSettings {
  volume: number;
  pitch: number;
  // Add other settings as needed
}

// Collection related types
export interface Collection {
  _id: string;
  user: string;
  name: string;
  samples: AudioSample[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: string[];
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

// Modal context types
export interface ModalContextType {
  isOpen: boolean;
  content: React.ReactNode;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}