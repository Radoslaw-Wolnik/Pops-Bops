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
