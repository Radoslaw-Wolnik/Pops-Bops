// --- user releted types ---

export interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  // role: 'user' | 'admin'; mby here
}
  
export interface FullUser extends User {
  email: string;
  isVerified?: boolean;
  role: 'user' | 'admin';
}

// sending user data
export interface LoginCredentials {
  email: string;
  password: string;
}

// creating user 
export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterAdminData {
  username: string;
  email: string;
  password: string;
}

//  --- audio related ---

export interface AudioSample {
  _id: string;
  name: string;
  audioUrl: string;
  iconUrl: string;
  forMainPage: boolean;
  settings: AudioSettings; // not sure for settings if we will record most of them
}

export interface AudioSettings {
  // Add any specific audio settings here
  volume: number;
  pitch: number;
  // ... other settings
}


// collections
export interface Collection {
  _id: string;
  user: string;
  name: string;
  samples: AudioSample[];
}

/*
// New type for admin list response
export type AdminListResponse = User[];

// New type for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Error response type
export interface ErrorResponse {
  message: string;
}
  */