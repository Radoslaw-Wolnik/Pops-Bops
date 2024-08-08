// user releted types

export interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}
  
export interface FullUser extends User {
  email: string;
  isVerified?: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  username: string;
  email: string;
  password: string;
}

// Audio releted types

export interface AudioSample {
  _id: string;
  name: string;
  audioUrl: string;
  settings: AudioSettings;
  createdAt: Date;
  user: string; // User ID
}

export interface AudioSettings {
  frequency: number;
  volume: number;
  duration: number;
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  // Add more parameters as needed
}

export interface Preset {
  _id: string;
  name: string;
  settings: AudioSettings;
  user: string; // User ID
}

export interface Collection {
  _id: string;
  name: string;
  samples: string[]; // Array of AudioSample IDs
  user: string; // User ID
}
