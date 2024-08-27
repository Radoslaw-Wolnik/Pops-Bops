# API Documentation

## Table of Contents
- [Global Types](#global-types)
- [Authentication](#authentication)
- [Admin Routes](#admin-routes)
- [Audio Routes](#audio-routes)
- [Auth Routes](#auth-routes)
- [Icon Routes](#icon-routes)
- [User Routes](#user-routes)

## Global Types

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isVerified: boolean;
  role: 'user' | 'admin';
}

interface AudioSample {
  _id: string;
  name: string;
  audioUrl: string;
  iconUrl: string;
  settings: Record<string, any>;
  createdAt: Date;
}

interface UserAudioSample extends AudioSample {
  user: string; // User ID
}

interface DefaultAudioSample extends AudioSample {
  forMainPage: boolean;
}

interface Collection {
  _id: string;
  user: string; // User ID
  name: string;
  samples: string[]; // Array of AudioSample IDs
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints.

Authentication requirement is indicated for each endpoint as follows:
- 🔒 Authentication required
- 🔓 No authentication required


## Admin Routes

### Get All Admins
```typescript
🔒 GET /admin/users
Response: ApiResponse<User[]>
```

### Delete Admin
```typescript
🔒 DELETE /admin/users/:id
Response: ApiResponse<{ message: string }>
```

### Add Admin
```typescript
🔒 POST /admin/users
Body: { username: string; email: string; password: string }
Response: ApiResponse<User>
```

## Audio Routes

### Get Main Page Samples
```typescript
🔓 GET /audio/main-samples
Response: ApiResponse<DefaultAudioSample[]>
```

### Get User Samples
```typescript
🔒 GET /audio/my-samples
Response: ApiResponse<UserAudioSample[]>
```

### Create Collection
```typescript
🔒 POST /audio/collections
Body: { name: string }
Response: ApiResponse<Collection>
```

### Add to Collection
```typescript
🔒 POST /audio/collections/:id/add
Body: { sampleId: string }
Response: ApiResponse<Collection>
```

### Get User Collections
```typescript
🔒 GET /audio/collections
Response: ApiResponse<Collection[]>
```

### Upload Audio
```typescript
🔒 POST /audio/upload-audio
Body: FormData
Response: ApiResponse<{ fileName: string; fileUrl: string }>
```

### Upload Default Audio
```typescript
🔒 POST /audio/upload-default-audio
Body: FormData
Response: ApiResponse<{ fileName: string; fileUrl: string }>
```

### Save User Audio Sample with Icon
```typescript
🔒 POST /audio/user-audio-sample
Body: { name: string; audioUrl: string; iconUrl: string; settings: Record<string, any> }
Response: ApiResponse<UserAudioSample>
```

### Update User Audio Sample Icon
```typescript
🔒 PUT /audio/user-audio-sample/:id/icon
Body: { iconUrl: string }
Response: ApiResponse<UserAudioSample>
```

### Save Default Audio Sample with Icon
```typescript
🔒 POST /audio/default-audio-sample
Body: { name: string; audioUrl: string; iconUrl: string; settings: Record<string, any>; forMainPage: boolean }
Response: ApiResponse<DefaultAudioSample>
```

### Delete User Sample
```typescript
🔒 DELETE /audio/sample/:id
Response: ApiResponse<{ message: string }>
```

### Delete Default Sample
```typescript
🔒 DELETE /audio/default-sample/:id
Response: ApiResponse<{ message: string }>
```

### Delete Collection
```typescript
🔒 DELETE /audio/collections/:id
Response: ApiResponse<{ message: string }>
```

## Auth Routes

### Register
```typescript
🔓 POST /auth/register
Body: { username: string; email: string; password: string }
Response: ApiResponse<User>
```

### Login
```typescript
🔓 POST /auth/login
Body: { email: string; password: string }
Response: ApiResponse<{ token: string; user: User }>
```

### Logout
```typescript
🔒 POST /auth/logout
Response: ApiResponse<{ message: string }>
```

### Refresh Token
```typescript
🔒 POST /auth/refresh-token
Response: ApiResponse<{ token: string }>
```

### Send Verification Email
```typescript
🔒 POST /auth/send-verification
Response: ApiResponse<{ message: string }>
```

### Verify Email
```typescript
🔓 GET /auth/verify-email/:token
Response: ApiResponse<{ message: string }>
```

### Change Password
```typescript
🔒 PUT /auth/change-password
Body: { oldPassword: string; newPassword: string }
Response: ApiResponse<{ message: string }>
```

### Request Password Reset
```typescript
🔓 POST /auth/request-password-reset
Body: { email: string }
Response: ApiResponse<{ message: string }>
```

### Reset Password
```typescript
🔓 POST /auth/reset-password/:token
Body: { password: string }
Response: ApiResponse<{ message: string }>
```

## Icon Routes

### Upload Icon
```typescript
🔒 POST /icon/upload-icon
Body: FormData
Response: ApiResponse<{ fileName: string; fileUrl: string }>
```

### Upload Default Icon
```typescript
🔒 POST /icon/upload-default-icon
Body: FormData
Response: ApiResponse<{ fileName: string; fileUrl: string }>
```

## User Routes

### Get User's Own Profile
```typescript
🔒 GET /user/me
Response: ApiResponse<User>
```

### Upload Profile Picture
```typescript
🔒 PUT /user/upload-profile-picture
Body: FormData
Response: ApiResponse<User>
```

## Error Responses
All endpoints may return the following error responses:

### 
```typescript
{
  error: string;
  message: string;
  statusCode: number;
}
```

Common status codes:
 - 400: Bad Request
 - 401: Unauthorized
 - 403: Forbidden
 - 404: Not Found
 - 500: Internal Server Error

## Rate Limiting
API requests are limited to 100 requests per IP address per hour. Exceeding this limit will result in a 429 (Too Many Requests) error.

## Versioning
This documentation is for API version 1.0. The base URL for all endpoints is:
```
https://api.example.com/api
// should/will be https://api.example.com/v1
```

## Examples
### Register a new user
Request
```typescript
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123"
}
```
Response
```typescript
{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "newuser",
    "email": "newuser@example.com",
    "profilePicture": "",
    "isVerified": false,
    "role": "user"
  },
  "message": "User registered successfully"
}
```

### Upload Audio
Request
```typescript
POST /audio/upload-audio
Cookie: session=abc123
Content-Type: multipart/form-data

[audio file data]
```
Response
```typescript
{
  "data": {
    "fileName": "mysong.mp3",
    "fileUrl": "https://storage.example.com/audio/mysong-123456.mp3"
  },
  "message": "Audio uploaded successfully"
}
```

### Login
Request
```typescript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```
Response
```typescript
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json

{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "user",
    "email": "user@example.com",
    "profilePicture": "",
    "isVerified": true,
    "role": "user"
  },
  "message": "Login successful"
}
```

### Get User's Own Profile
Request
```typescript
GET /user/me
Cookie: session=abc123
```
Response
```typescript
{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "user",
    "email": "user@example.com",
    "profilePicture": "",
    "isVerified": true,
    "role": "user"
  }
}
```


## Changelog
Version 1.0 (2024-08-27)
 - Initial API release